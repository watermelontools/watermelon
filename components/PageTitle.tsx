const PageTitle = ({ pageTitle }: { pageTitle: string }) => {
    return <div
        style={{
            background: "linear-gradient(42deg, rgba(173,56,56,1) 0%, rgba(219,97,97,1) 50%, rgba(249,246,244,1) 90%, rgba(255,255,255,1) 100%)"
        }}
        className="text-white py-2 pl-2 font-semibold text-xl h-10">
        <h1>{pageTitle}</h1>
    </div>
}
export default PageTitle