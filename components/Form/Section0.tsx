import { Box, TextInput } from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";
import { Application } from "../../lib/interfaces";


export function Section0({ form }: { form: UseFormReturnType<Application> }) {
    return (
        <Box>
            <h1>Application Details</h1>
            <TextInput
                withAsterisk
                label="Title of Project"
                {...form.getInputProps('title')}
            />
        </Box>
    );
}