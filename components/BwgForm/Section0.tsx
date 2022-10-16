import { Box, Group, Textarea, TextInput } from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";
import { Application } from "../../lib/interfaces";

export function Section0({ form }:{
    form: UseFormReturnType<Application>
    existingApplication?: Application
    readOnly?: boolean;
}){
    return (
        <Box>
            <Group grow>
                <TextInput
                    label="Principal Investigator"
                    readOnly= {true}
                    {...form.getInputProps('institutionPrimary.investigator')}
                />
                <TextInput
                    label="ApplicationID"
                    readOnly= {true}
                    {...form.getInputProps('id')}
                />
            </Group>
            <Textarea
                label="Title"
                readOnly= {true}
                {...form.getInputProps('title')}
            />
        </Box>
    )
}
