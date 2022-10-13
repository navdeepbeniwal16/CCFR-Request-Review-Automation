import { Autocomplete, Box, Button, CloseButton, Group, Space, Table, Text, Textarea, TextInput } from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";
import { useState } from "react";
import { Application } from "../../lib/interfaces";

export function Section3b(props: { form: UseFormReturnType<Application>; dataOption?: string[]; bioOption?:string[]}) {
    const { form, dataOption, bioOption } = props;

    const [formData, setFormData] = useState<Application['dataRequired']>(form.values.dataRequired);

    const newData = {
        name: '',
        type: '',
        quantity: 0,
        numSamples: 0,
    }

    const addNewData = () => {
        if (formData) {
            setFormData([...formData, newData])
        }
    }

    const handleChanges = (subType: string, event: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>, index: number) => {

        const { value } = event.target;
        const list = formData && [...formData];

        list[index][subType] = value;
        setFormData(list)

        form.setFieldValue('dataRequired', formData)
    }

    const handleChangesAuto = (subType: string, event: string, index: number) => {

        const value = event;
        const list = formData && [...formData];
   
        list[index][subType] = value;
        setFormData(list)
        form.setFieldValue('dataRequired', formData)

    }

    const removeData = (index: number) => {
        const list = formData && [...formData];
        const updatedList = list?.filter((value, _index) => _index !== index);

        setFormData(updatedList)
        form.setFieldValue('dataRequired', updatedList)
    }

    //console.log('real form', form.values)
    return (
        <Box>
            <h2>Section 3B: Specimen and Data Criteria</h2>

            <Text>
                Complete the following section to describe your selection
                criteria, the type of data and biospecimens, and preferred
                number of subjects/samples needed
            </Text>

            <Table>
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
                    {
                        formData && formData.map((data, index: number) => (
                            <tr key={index}>
                                <td>
                                    <Textarea
                                        autosize
                                        value={data.name}
                                        onChange={(event) => { handleChanges('name', event, index) }}
                                    ></Textarea>
                                </td>
                                <td>
                                    <Autocomplete
                                        placeholder="Pick one"
                                        data={[...dataOption||[], ...bioOption||[]]}
                                        value={data.type}
                                        onChange={(event) => { handleChangesAuto('type', event, index) }}
                                    />
                                </td>
                                <td>
                                    <TextInput
                                        type='number'
                                        onChange={(event) => { handleChanges('quantity', event, index) }}
                                        value={data.quantity}
                                    />
                                </td>
                                <td>
                                    <TextInput
                                        type='number'
                                        onChange={(event) => { handleChanges('numSamples', event, index) }}
                                        value={data.numSamples}
                                    />
                                </td>
                                <td>
                                    <CloseButton
                                        onClick={() => removeData(index)}
                                    />
                                </td>
                            </tr>

                        ))
                    }
                </tbody>
            </Table>

            <Space h="md" />
            <Button onClick={addNewData}>Add New</Button>
            <Space h="md" />

            <Group grow>
                <Text>*¹Limited primarily to Phase I high-risk probands</Text>
                <Text>*²Very limited availability</Text>
            </Group>
            <Space h="sm" />
            <Group grow>
                <Text>*³Limited to Phase I, no data for centers 15, 16</Text>
                <Text>
                    *⁴Limited to Phase-I probands, no data for centers 12 and 17
                </Text>
            </Group>
        </Box>
    );
}