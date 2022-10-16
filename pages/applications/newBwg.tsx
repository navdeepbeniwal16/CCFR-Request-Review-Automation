import {
    withAuthUser,
    AuthAction,
    withAuthUserTokenSSR,
    getFirebaseAdmin,
} from 'next-firebase-auth';
import BWGApplicationForm, { BWGApplicationFormProps } from '../../components/BWGForm';
import {
    getApplicationById,
    getExistingCCFRBiospecimens,
    getExistingCCFRData,
    getExistingCCFRSiteData,
} from '../../lib/application';

const NewApplicationPage = ({
    ccfrPeople,
    application,
    dataAvailable,
    bioAvailable,
}: ApplicationFormProps) => {
    return (
        <ApplicationForm
            title="New Application"
            ccfrPeople={ccfrPeople}
            application={application}
            dataAvailable={dataAvailable}
            bioAvailable={bioAvailable}
        />
    );
};

export const getServerSideProps = withAuthUserTokenSSR({
    whenUnauthed: AuthAction.REDIRECT_TO_LOGIN,
})(async ({ AuthUser, query }) => {
    const db = getFirebaseAdmin().firestore();
    const ppl = await getExistingCCFRSiteData(db);
    const dta = await getExistingCCFRData(db);
    const bio = await getExistingCCFRBiospecimens(db);

    const _props: ApplicationFormProps = {
        ccfrPeople: ppl.map(p => ({
            centerNumber: parseInt(p.centerNumber),
            ccfrSite: p.siteName,
            sitePIName: p.pIName,
            sitePIDegree: p.pIDegree,
        })),
        dataAvailable: dta.map(d => d.name),
        bioAvailable: bio.map(b => b.name),
        ...(query.id
            ? { application: await getApplicationById(db, query.id as string) }
            : {}),
    };

    return {
        props: _props,
    };
});

export default withAuthUser<ApplicationFormProps>({
    whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
})(NewApplicationPage);
