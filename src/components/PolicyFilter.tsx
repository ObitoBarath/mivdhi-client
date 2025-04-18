import { SetStateAction, useEffect, useRef, useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { InputNumber } from 'primereact/inputnumber';
import { Button } from 'primereact/button';
import { SelectButton, SelectButtonChangeEvent } from 'primereact/selectbutton';
import { OverlayPanel } from 'primereact/overlaypanel';
import './PolicyFilter.css';
import axiosAPI from '../config/AxiosConfig.ts';
import {PolicyFilterCriteria} from "../utils/usePolicyData.ts";

interface PolicyFilterProps {
    handleFilterSubmit: () => void;
    setPolicyFilter: SetStateAction<any >;
}

const PolicyFilter = ({ handleFilterSubmit, setPolicyFilter }: PolicyFilterProps) => {
    const options = [
        { icon: 'pi pi-sort-alpha-up', value: 'asc' },
        { icon: 'pi pi-sort-alpha-down', value: 'desc' }
    ];

    const [value, setValue] = useState<string>(options[0].value);
    const [policyTypes, setPolicyTypes] = useState<{ value: string; label: string }[]>([]);
    const [filters, setFilters] = useState<PolicyFilterCriteria>({
        name: null,
        policyType: null,
        minPremium: null,
        maxPremium: null,
        coverage: null,
        sortOrder: 'asc',
    });

    const op = useRef<OverlayPanel | null>(null);

    useEffect(() => {
        const fetchPolicyTypes = async () => {
            try {
                const response = await axiosAPI.get('/policies/getPolicyTypes');
                const data = response.data?.map((type: string) => ({ value: type, label: type })) || [];
                setPolicyTypes(data);
            } catch (error) {
                console.error('Error fetching policy types:', error);
            }
        };

        fetchPolicyTypes();
    }, []);

    const handleInputChange = (key: keyof PolicyFilterCriteria, val: string | number | null) => {
        setFilters((prev: any) => ({ ...prev, [key]: val +"" }));
    };

    useEffect(() => {
        handleInputChange('sortOrder', value);
    }, [value]);

    useEffect(() => {
        setPolicyFilter(filters);
    }, [filters]);

    const justifyTemplate = (option: { icon: string }) => <i className={option.icon}></i>;


    return (
        <div className="card flex flex-column gap-3">
            <Button
                icon="pi pi-filter"
                onClick={(e) => op.current?.toggle(e)}
            />

            <OverlayPanel ref={op} style={{ height: 'auto', width: '35%' }}>
                <div className="grid g-3" style={{ padding: '5% 0 0 5%' }}>
                    {/* Policy Name */}
                    <div className="grid justify-center items-center col-12">
                        <div className="col-5 flex align-items-center">
                            <label htmlFor="name" className="form-label">Policy Name</label>
                        </div>
                        <div className="col-6">
                            <InputText
                                id="name"
                                placeholder="Policy Name"
                                className="p-inputtext-sm form-control"
                                style={{ width: '100%' }}
                                value={filters.name || ''}
                                onChange={(e) => handleInputChange('name', e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Policy Type */}
                    <div className="grid justify-center items-center col-12">
                        <div className="col-5 flex align-items-center">
                            <label htmlFor="type" className="form-label">Type</label>
                        </div>
                        <div className="col-6">
                            <Dropdown
                                id="type"
                                className="form-select"
                                style={{ width: '100%' }}
                                options={policyTypes}
                                value={filters.policyType}
                                onChange={(e) => handleInputChange('policyType', e.value)}
                                placeholder="Select"
                            />
                        </div>
                    </div>

                    {/* Premium Range */}
                    <div className="grid justify-center items-center col-12">
                        <div className="col-5 flex align-items-center">
                            <label className="form-label">Premium</label>
                        </div>
                        <div className="grid grid-nogutter col-6">
                            <div className="col-5">
                                <InputNumber
                                    inputId="minPremium"
                                    className="p-inputtext-sm"
                                    placeholder="Min"
                                    value={filters.minPremium ?? null}
                                    onValueChange={(e) => handleInputChange('minPremium', e.value+"")}
                                />
                            </div>
                            <div className="col"></div>
                            <div className="col-5">
                                <InputNumber
                                    inputId="maxPremium"
                                    className="p-inputtext-sm"
                                    placeholder="Max"
                                    value={filters.maxPremium ?? null}
                                    onValueChange={(e) => handleInputChange('maxPremium', e.value+"")}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Coverage */}
                    <div className="grid justify-center items-center col-12">
                        <div className="col-5 flex align-items-center">
                            <label htmlFor="coverage" className="form-label">Coverage</label>
                        </div>
                        <div className="col-6">
                            <InputNumber
                                inputId="coverage"
                                placeholder="Coverage"
                                className="form-control"
                                style={{ width: '100%' }}
                                value={(filters.coverage !== null && parseInt(filters.coverage)) || null}
                                onValueChange={(e) => handleInputChange('coverage', e.value+"")}
                            />
                        </div>
                    </div>

                    {/* Sort Order */}
                    <div className="grid justify-center items-center col-12">
                        <div className="col-5">
                            <label className="form-label">Sort Order</label>
                        </div>
                        <div className="col-6">
                            <SelectButton
                                optionLabel="value"
                                itemTemplate={justifyTemplate}
                                value={value}
                                onChange={(e: SelectButtonChangeEvent) => setValue(e.value)}
                                options={options}
                            />
                        </div>
                    </div>

                    {/* Apply Button */}
                    <div className="grid justify-center items-center col-12">
                        <div style={{ width: '90%', margin: '2%', border: '1px solid #f2f0f0' }} />
                        <div className="grid grid-nogutter col-12" style={{ width: '93%' }}>
                            <Button
                                label="Apply Filters"
                                icon="pi pi-check"
                                iconPos="left"
                                style={{ width: '100%' }}
                                onClick={handleFilterSubmit}
                            />
                        </div>
                    </div>
                </div>
            </OverlayPanel>
        </div>
    );
};

export default PolicyFilter;
