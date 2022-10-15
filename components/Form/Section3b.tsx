import {
    Autocomplete,
    Box,
    Button,
    CloseButton,
    Group,
    Space,
    Table,
    Text,
    Textarea,
    TextInput,
} from '@mantine/core';
import { UseFormReturnType } from '@mantine/form';
import { useState } from 'react';
import { Application, Request as AppRequest } from '../../lib/interfaces';

export function Section3b({
    form,
    readOnly,
    dataOption,
    bioOption,
}: {
    form: UseFormReturnType<Application>;
    readOnly?: boolean;
    dataOption?: string[];
    bioOption?: string[];
}) {
    const emptyRow = {
        name: '',
        type: '',
        numSamples: 0,
    };

    const initialFormData = [
        ...(form.values.dataRequired ? form.values.dataRequired : []),
        ...(form.values.biospecimenRequired
            ? form.values.biospecimenRequired
            : []),
    ];

    const [formData, setFormData] = useState<AppRequest[]>(
        initialFormData.length > 0 ? initialFormData : [emptyRow],
    );

    const addRow = () => setFormData([...formData, emptyRow]);

    const removeRow = (index: number) => {
        const list = formData && [...formData];
        const updatedList = list.filter((value, _index) => _index !== index);
        setRequests(updatedList);
    };

    const setRequests = (updatedList: AppRequest[]) => {
        setFormData(updatedList);
        const dataList = updatedList.filter(x => dataOption?.includes(x.type));
        const biospecimenList = updatedList.filter(x =>
            bioOption?.includes(x.type),
        );
        form.setFieldValue('dataRequired', dataList);
        form.setFieldValue('biospecimenRequired', biospecimenList);
    };

    const handleChanges = <RequestKey extends keyof AppRequest>(
        subType: RequestKey,
        value: any,
        index: number,
    ) => {
        const list = formData && [...formData];
        list[index][subType] = value as AppRequest[RequestKey];
        setRequests(list);
    };

    const autocompleteData = [
        ...(dataOption?.map(x => ({
            value: x,
            group: 'Data',
        })) || []),
        ...(bioOption?.map(x => ({
            value: x,
            group: 'Biospecimens',
        })) || []),
    ];

    const tableCellStyle = {
        root: { height: '100%' },
        wrapper: { height: '100%' },
        input: { height: '100%' },
    };

    return (
        <Box>
            <h2>Section 3B: Specimen and Data Criteria</h2>

            <Text>
                Complete the following section to describe your selection
                criteria, the type of data and biospecimens, and preferred
                number of subjects/samples needed
            </Text>

            <Table style={{ height: '100%' }}>
                <thead>
                    <tr>
                        <th>Selection Criteria</th>
                        <th>Type of Data/BioSpecimen</th>
                        <th>Amount of BioSpecimen</th>
                        <th>No. Participants/Samples</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {formData &&
                        formData.map((data, index: number) => (
                            <tr key={index}>
                                <td>
                                    <Textarea
                                        autosize
                                        minRows={2}
                                        value={data.name}
                                        onChange={event => {
                                            handleChanges(
                                                'name',
                                                event.target.value,
                                                index,
                                            );
                                        }}
                                        readOnly={readOnly}
                                        styles={tableCellStyle}
                                    ></Textarea>
                                </td>
                                <td>
                                    {readOnly ? (
                                        <Textarea
                                            value={data.type}
                                            readOnly={readOnly}
                                            styles={tableCellStyle}
                                        />
                                    ) : (
                                        <Autocomplete
                                            placeholder="Pick one"
                                            data={autocompleteData}
                                            limit={autocompleteData.length}
                                            maxDropdownHeight={'30vh'}
                                            value={data.type}
                                            onChange={event => {
                                                handleChanges(
                                                    'type',
                                                    event,
                                                    index,
                                                );
                                            }}
                                            styles={tableCellStyle}
                                        />
                                    )}
                                </td>
                                <td>
                                    <TextInput
                                        type="number"
                                        onChange={event => {
                                            handleChanges(
                                                'quantity',
                                                event.target.value,
                                                index,
                                            );
                                        }}
                                        value={data.quantity}
                                        readOnly={readOnly}
                                        styles={tableCellStyle}
                                        disabled={
                                            !bioOption?.includes(data.type) &&
                                            !readOnly
                                        }
                                    />
                                </td>
                                <td>
                                    <TextInput
                                        type="number"
                                        onChange={event => {
                                            handleChanges(
                                                'numSamples',
                                                event.target.value,
                                                index,
                                            );
                                        }}
                                        value={data.numSamples}
                                        readOnly={readOnly}
                                        styles={tableCellStyle}
                                    />
                                </td>
                                <td>
                                    {!readOnly && (
                                        <CloseButton
                                            style={{
                                                visibility:
                                                    index == 0
                                                        ? 'hidden'
                                                        : 'unset',
                                            }}
                                            onClick={() => removeRow(index)}
                                        />
                                    )}
                                </td>
                            </tr>
                        ))}
                </tbody>
            </Table>
            <Space h="md" />
            {!readOnly && <Button onClick={addRow}>Add New</Button>}
        </Box>
    );
}
