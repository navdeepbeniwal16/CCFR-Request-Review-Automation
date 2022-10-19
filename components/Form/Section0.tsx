import { Box, Textarea } from '@mantine/core';
import { UseFormReturnType } from '@mantine/form';
import { Application } from '../../lib/interfaces';

export function Section0({
    form,
    title,
    readOnly,
}: {
    form: UseFormReturnType<Application>;
    title?: string;
    readOnly?: boolean;
}) {
    return (
        <Box>
            <h1>{title || 'Application Details'}</h1>
            <Textarea
                withAsterisk={!readOnly}
                required
                label="Title of Project"
                {...form.getInputProps('title')}
                readOnly={readOnly}
            />
        </Box>
    );
}
