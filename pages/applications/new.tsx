import { Container, Grid, TextInput, Group, Button } from '@mantine/core';
import {
    withAuthUser,
    AuthAction,
    withAuthUserTokenSSR,
    getFirebaseAdmin,
} from 'next-firebase-auth';
import ApplicationForm, { ApplicationFormProps } from '../../components/Form';
import { getExistingCCFRBiospecimens, getExistingCCFRData, getExistingCCFRSiteData } from '../../lib/application';


const NewApplicationPage = ({ccfrPeople, dataAvailable, bioAvailable}:ApplicationFormProps) => {
    return (
        <>
            <h1>New Application</h1>
            <ApplicationForm
                //application={}
                //readOnly = {}
                ccfrPeople = {ccfrPeople}
                dataAvailable =  {dataAvailable}
                bioAvailable = {bioAvailable}
            />
        </>
    )
}

export const getServerSideProps = withAuthUserTokenSSR({
    whenUnauthed: AuthAction.REDIRECT_TO_LOGIN,
})(async ({ AuthUser, query }) => {

    const db = getFirebaseAdmin().firestore();
    const ppl = await getExistingCCFRSiteData(db);
    const dta = await getExistingCCFRData(db);
    const bio = await getExistingCCFRBiospecimens(db);

    const _props: ApplicationFormProps = {
        ccfrPeople: ppl.map(p => ({centerNumber: parseInt(p.centerNumber) , ccfrSite: p.siteName, sitePIName: p.pIName, sitePIDegree:p.pIDegree})),
        dataAvailable: dta.map(d => d.name),
        bioAvailable: bio.map(b => b.name),
    }

    return {
        props: _props,
    }
})

export default withAuthUser<ApplicationFormProps>({
    whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
})(NewApplicationPage)