export default function PageHeaders({
    heading, subHeading
}) {
    return (
        <div className="text-center py-24">
            <h1 className="text-4xl font-bold">{heading}</h1>
            <p className="text-white/60 text-lg">{subHeading}</p>
        </div>
    )
}