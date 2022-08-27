import Error from "next/error";

function CustomError({ statusCode }) {
    return <Error statusCode={statusCode} withDarkMode={false} />;
}

CustomError.getInitialProps = ({ res, err }) => {
    const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
    return { statusCode };
};

CustomError.getLayout = function getLayout(page) {
    return <>{page}</>;
};

export default CustomError;