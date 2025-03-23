export default function NodeBox({title, description, x, y}:
    {title:string,description:string, x:number, y:number}) {
    
    return (
        <div className="step rectangle">
            <div className="step-header">
                <span className="step-title">{title}</span>
            </div>
            <div className="step-content">{description}</div>
        </div>
    );
}