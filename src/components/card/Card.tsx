export default function Card({ className, children }: { className?: string, children?: React.ReactNode }) {
    return (
        <div className={`card ${className}`}>
            <div className="card-body">
                {children}
            </div>
        </div>
    )
}