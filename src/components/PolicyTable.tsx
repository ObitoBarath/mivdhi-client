import {
    useState,
    useRef,
    ChangeEvent,
    useLayoutEffect,
} from "react";
import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";
import {InputText} from "primereact/inputtext";
import {IconField} from "primereact/iconfield";
import {InputIcon} from "primereact/inputicon";
import {Tag} from "primereact/tag";
import {Paginator, PaginatorPageChangeEvent} from "primereact/paginator";
import {Button as PrimeButton} from "primereact/button";
import {Toolbar} from "primereact/toolbar";
import {Divider} from "primereact/divider";
import PolicyFilter from "./PolicyFilter";
import usePolicyData, {PolicyFilterCriteria} from "../utils/usePolicyData.ts";
import {Messages} from "primereact/messages";

interface Customer {
    name: string;
    type: string;
    premium: number;
    coverage: number;
}

export default function PolicyTable() {
    const rowsPerPage = 5;
    // const toast = useRef<Toast>(null);
    const [first, setFirst] = useState(0);
    const [searchValue, setSearchValue] = useState("");
    const toast = useRef<Messages>(null);
    const [policyFilter, setPolicyFilter] = useState<PolicyFilterCriteria>({
        name: null,
        policyType: null,
        maxPremium: null,
        minPremium: null,
        coverage: null,
        sortOrder: "asc",
    });


    const {
        customers,
        loading,
        totalRecords,
        isPaginationRequired,
        fetchTableData,
        handleFilterSubmit,
        setPaginationRequired,
        setCustomers,
        setTotalRecords,
    } = usePolicyData(policyFilter, toast);
    const [currentPage, setCurrentPage] = useState<number>(0)

    useLayoutEffect(() => {
        fetchTableData(0, rowsPerPage, true);
    }, []);

    const onSearchHandler = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchValue(value);

        if (!value) {
            setFirst(0);
            fetchTableData(0, rowsPerPage, true);
        } else {
            fetchTableData(currentPage, rowsPerPage, true, value);
        }
        setPaginationRequired(true)
    };

    const onRefreshHandler = () => {
        setSearchValue("");
        setFirst(0);
        fetchTableData(0, rowsPerPage, true);
        setPaginationRequired(true)
    };

    const onPageChange = (event: PaginatorPageChangeEvent) => {
        const newPage = event.first / rowsPerPage;
        setFirst(event.first);
        setCurrentPage(newPage +1);
        fetchTableData(newPage, rowsPerPage);
    };

    const getSeverity = (status: string): 'success' | 'info' | 'warning' | 'danger' | 'secondary' | 'contrast' | null | undefined => {
        switch (status) {
            case "Vehicle":
                return "danger";
            case "Health":
                return "success";
            case "new":
                return "info";
            case "Term Life":
                return "warning";
            default:
                return null;
        }
    };

    const statusBodyTemplate = (rowData: Customer) => (
        <Tag value={rowData.type} severity={getSeverity(rowData.type)}/>
    );
    const coverageTemplate = (rowData: Customer) => <span>{rowData.coverage}</span>;

    return (
        <div className="card">
            <div style={{position : "absolute" , top : "0" , right : "5%"}}>
                <Messages ref={toast} />
            </div>


            <Toolbar
                start={<PrimeButton icon="pi pi-refresh" onClick={onRefreshHandler}/>}
                center={
                    <IconField iconPosition="left">
                        <InputIcon className="pi pi-search"/>
                        <InputText
                            value={searchValue}
                            onChange={onSearchHandler}
                            placeholder="Search by Policy Name ...."
                        />
                    </IconField>
                }
                end={
                    <PolicyFilter
                        handleFilterSubmit={() =>
                            handleFilterSubmit(setPaginationRequired, setCustomers, setTotalRecords, setFirst)
                        }
                        setPolicyFilter={setPolicyFilter}
                    />
                }
            />

            <Divider/>

            <DataTable
                size="large"
                removableSort
                value={customers}
                stripedRows
                rows={rowsPerPage}
                totalRecords={totalRecords}
                dataKey="name"
                loading={loading}
                scrollable
                scrollHeight="30rem"
                emptyMessage="No Records found."
            >
                <Column field="name" header="Name" style={{minWidth: "12rem"}}/>
                <Column field="type" header="Status" body={statusBodyTemplate} style={{minWidth: "12rem"}}/>
                <Column field="premium" header="Premium" sortable style={{minWidth: "12rem"}}/>
                <Column field="coverage" header="Coverage" body={coverageTemplate} style={{minWidth: "12rem"}}/>
            </DataTable>

            <Divider/>

            <Toolbar
                start={<label style={{color: "black"}}>In total there are {totalRecords} policies.</label>}
                end={
                    isPaginationRequired && (
                        <Paginator
                            template="FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
                            first={first}
                            rows={rowsPerPage}
                            totalRecords={totalRecords}
                            onPageChange={onPageChange}
                        />
                    )
                }
            />
        </div>
    );
}
