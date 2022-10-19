import { Box, Table, Text } from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";
import { Application } from "../../lib/interfaces";

export function Section1({ form }:{
    form: UseFormReturnType<Application>
}){
    const existingBio = form.values?.biospecimenRequired?.filter(data => data.quantity)
    const rows = existingBio?.map((data, index) =>(
        <tr key={index}>
            <td>
                <Text>{data.type}</Text>
            </td>
            <td>
                <Text>{data.quantity}</Text>
            </td>
        </tr>
    ));
    return (
        <Box>
            <h2>{'Section 1: Amount of Biospecimen Requested'}</h2>
            <Table>
                <thead>
                    <tr>
                        <th>Biospecimens</th>
                        <th>Amount Required</th>
                    </tr>
                </thead>
                <tbody>{rows}</tbody>
            </Table>
        </Box>
    )
}