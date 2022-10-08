import { TextInput, Checkbox, Button, Group, Box } from '@mantine/core';
import { useForm, UseFormReturnType } from '@mantine/form';
import { AuthAction, withAuthUser, withAuthUserTokenSSR } from 'next-firebase-auth';
import { Application } from '../lib/interfaces';
// import { ApplicationsPage } from './applications';


type ApplicationsPageProps = {
    title: string | null
    applications: Application[]
}

type FormDetailsProps = {
    email: string,
    termsOfService: boolean
}

function Demo() {
    const form = useForm({
        initialValues: {
            email: '',
            termsOfService: false,
        },

        validate: {
            email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
        },
    });

    return (
        <>
            <Section1 form={form} />
            <Section2 />
        </>
        // <Box sx={{ maxWidth: 300 }} mx="auto">
        //   <form onSubmit={form.onSubmit((values) => console.log(values))}>
        //     <TextInput
        //       withAsterisk
        //       label="Email"
        //       placeholder="your@email.com"
        //       {...form.getInputProps('email')}
        //     />

        //     <Checkbox
        //       mt="md"
        //       label="I agree to sell my privacy"
        //       {...form.getInputProps('termsOfService', { type: 'checkbox' })}
        //     />

        //     <Group position="right" mt="md">
        //       <Button type="submit">Submit</Button>
        //     </Group>
        //   </form>
        // </Box>
    );
}

function Section2() {
    const form = useForm({
        initialValues: {
            email: '',
            termsOfService: false,
        },

        validate: {
            email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
        },
    });

    return (
        <Box sx={{ maxWidth: 300 }} mx="auto">
            <form onSubmit={form.onSubmit((values) => console.log(values))}>
                <TextInput
                    withAsterisk
                    label="Email"
                    placeholder="your@email.com"
                    {...form.getInputProps('email')}
                />

                <Checkbox
                    mt="md"
                    label="I agree to sell my privacy"
                    {...form.getInputProps('termsOfService', { type: 'checkbox' })}
                />

                <Group position="right" mt="md">
                    <Button type="submit">Submit</Button>
                </Group>
            </form>
        </Box>
    );
}
function Section1({ form }: { form: UseFormReturnType<FormDetailsProps> }) {
    //   const form = useForm({
    //     initialValues: {
    //       email: '',
    //       termsOfService: false,
    //     },

    //     validate: {
    //       email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
    //     },
    //   });

    return (
        <Box sx={{ maxWidth: 300 }} mx="auto">
            <form onSubmit={form.onSubmit((values: FormDetailsProps) => console.log(values))}>
                <TextInput
                    withAsterisk
                    label="Email"
                    placeholder="your@email.com"
                    {...form.getInputProps('email')}
                />

                <Checkbox
                    mt="md"
                    label="I agree to sell my privacy"
                    {...form.getInputProps('termsOfService', { type: 'checkbox' })}
                />

                <Group position="right" mt="md">
                    <Button type="submit">Submit</Button>
                </Group>
            </form>
        </Box>
    );
}

export const getServerSideProps = withAuthUserTokenSSR({
    whenUnauthed: AuthAction.REDIRECT_TO_LOGIN,
})(async ({ AuthUser, query }) => {
    const appType: ApplicationsPageProps['title'] = query.type?.toString() || null

    const _props: ApplicationsPageProps = {
        title: appType,
        applications: data,
    }

    return {
        props: _props,
    }
})

export default withAuthUser<ApplicationsPageProps>({
    whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
})(Demo)

const data: Application[] = [
    {
        id: String(Math.floor(Math.random() * 10000)),
        title: "Impact of Inflammatory Bowel Disease on CRC Mortality.",
        institutionPrimary: {
            investigator: 'Scott Adams',
            institution: "University of Melbourne",
        },
        dataRequired: [{
            name: "test",
            type: "test",
            quantity: 10,
            numSamples: 1,
        }],
        status: 'active',
    }
];