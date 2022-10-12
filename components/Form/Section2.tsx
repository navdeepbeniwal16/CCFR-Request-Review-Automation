import { Box, Button, Checkbox, CloseButton, Group, Space, Table, Text, TextInput } from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";
import { useEffect, useState } from "react";
import { Application, Collaborator } from "../../lib/interfaces";

export function Section2(props: { form: UseFormReturnType<Application>; ccfrPeople: Collaborator[]; }) {
    const { form, ccfrPeople } = props;
    const [peopleInTable, setpeopleInTable] = useState<Collaborator[]>(ccfrPeople?.filter(data => data.centerNumber));
    const [checkedPeopleInTable, setCheckedPeopleInTable] = useState<Collaborator[]>([]);
    const [formData, setFormData] = useState<Collaborator[]>(ccfrPeople?.filter(data => !data.centerNumber));
    useEffect(()=>{form.setFieldValue('ccfrCollaborators', [...checkedPeopleInTable as Collaborator[], ...formData as Collaborator[]])},[checkedPeopleInTable])

    const handleCheckboxOnClick = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {

        if(event.currentTarget.checked){
            setCheckedPeopleInTable([...checkedPeopleInTable, peopleInTable[index]])
        } else {
            setCheckedPeopleInTable(checkedPeopleInTable?.filter(data=>data!=peopleInTable[index]))
            
        }

    }
    const rows = peopleInTable?.map((_ccfrPeople, i) => (
        <tr key={i}>
            <td>{_ccfrPeople.centerNumber}</td>
            <td>
                <Group spacing="xs">
                    <Text italic>{_ccfrPeople.ccfrSite},</Text>
                    <Text>Site PI:</Text>
                    <Text weight="700">
                        {_ccfrPeople.sitePIName}, {_ccfrPeople.sitePIDegree}
                    </Text>
                </Group>
            </td>
            <td>
                <Checkbox
                    onChange={(event) => handleCheckboxOnClick(event, i)}
                />
            </td>
        </tr>
    ));

    const newData = {
        sitePIName: '',
        ccfrSite: '',
        isChecked: true,
    }

    const addNewData = () => {
        if (formData) {
            setFormData([...formData, newData])
        }
    }

    const removeData = (index: number) => {
        const list = formData && [...formData];
        const updatedList = list?.filter((value, _index) => _index !== index);

        console.log('updatedLst', updatedList)
        setFormData(updatedList)

        const allData = updatedList && checkedPeopleInTable && [...checkedPeopleInTable, ...updatedList]

        form.setFieldValue('ccfrCollaborators', allData as Collaborator[])
    }

    const handleChanges = (subType: string, event: React.ChangeEvent<HTMLInputElement>, index: number) => {

        const { value } = event.target;
        const list = formData && [...formData];

        list[index][subType] = value;
        setFormData(list)

        const allData = checkedPeopleInTable && formData && [...checkedPeopleInTable, ...formData]

        form.setFieldValue('ccfrCollaborators', allData as Collaborator[])
    }

    return (
        <Box>
            <h2>Section 2: CCFR Collaborators</h2>
            {/* Table 1 */}
            <Table>
                <thead>
                    <tr>
                        <th>Center Number</th>
                        <th>CCFR Site and Site Principal Investigator</th>
                        <th>Check which apply (if known)</th>
                    </tr>
                </thead>
                <tbody>{rows}</tbody>
            </Table>
            <Space h="md" />
            <Button onClick={addNewData}>Add new Collaborators</Button>
            <Space h="md" />

            {/* Table 2 */}
            <Table>
                <thead>
                    <tr>
                        <th>Other Collaborating Investigators</th>
                        <th>Affiliation</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {
                        formData?.map((data, index: number) => (
                            <tr key={index}>

                                <td>
                                    <TextInput
                                        onChange={(event) => { handleChanges('sitePIName', event, index) }}
                                        value={data.sitePIName}
                                    />
                                </td>
                                <td>
                                    <TextInput
                                        onChange={(event) => { handleChanges('ccfrSite', event, index) }}
                                        value={data.ccfrSite}
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

        </Box>
    );
}