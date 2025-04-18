import { useState } from "react";
import axiosAPI from "../config/AxiosConfig.ts";
import {Message} from "primereact/message";

export interface PolicyFilterCriteria {
    name: string | null;
    policyType: string | null;
    maxPremium: number | null;
    minPremium: number | null;
    coverage: number | string | null | undefined;
    sortOrder: string;
}

interface Customer {
    name: string;
    type: string;
    premium: number;
    coverage: number;
}

export default function usePolicyData(
    policyFilter: PolicyFilterCriteria,
    toastRef: React.RefObject<Message> | any
) {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [totalRecords, setTotalRecords] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false);
    const [isPaginationRequired, setPaginationRequired] = useState<boolean>(true);

    const fetchTableData = async (
        page: number,
        limit: number,
        totalPagesRequired: boolean = false,
        name: string | null = null
    ) => {
        try {
            setLoading(true);
            const response = await axiosAPI.get("/policies", {
                params: { page, size: limit, totalPagesRequired, name },
            });

            setCustomers(response?.data?.policies || []);
            if (response?.data?.totalPages) {
                setTotalRecords(response.data.totalPages);
            }
        } catch (error) {
            console.error("API error:", error);
            toastRef.current?.show(
                { sticky: false, life: 500, severity: 'error', summary: 'Error', detail: 'No Records Found!', closable: false },
            );
        } finally {
            setLoading(false);
        }
    };

    const handleFilterSubmit = async (
        setPaginationRequired: (val: boolean) => void,
        setCustomers: (data: Customer[]) => void,
        setTotalRecords: (val: number) => void,
        setFirst: (val: number) => void
    ) => {
        try {
            setLoading(true);
            const response = await axiosAPI.get("/policies/filter", {
                params: {
                    ...policyFilter,
                    name: policyFilter.name || null,
                    policyType: policyFilter.policyType || null,
                },
            });

            const data = response?.data ?? [];

            if (!data.length) {
                toastRef.current?.show(
                    { sticky: false, life: 500, severity: 'error', summary: 'Error', detail: 'No Records Found!', closable: false },
                );
                setPaginationRequired(false);
            } else {
                setPaginationRequired(false);
            }

            setCustomers(data);
            setTotalRecords(data.length);
            setFirst(0);
        } catch (error) {
            console.error("Filter API error:", error);
            toastRef.current?.show(
                { sticky: false, life: 500, severity: 'error', summary: 'Error', detail: 'No Records Found!', closable: false },
            );
        } finally {
            setLoading(false);
        }
    };

    return {
        customers,
        loading,
        totalRecords,
        isPaginationRequired,
        fetchTableData,
        handleFilterSubmit,
        setPaginationRequired,
        setCustomers,
        setTotalRecords,
    };
}
