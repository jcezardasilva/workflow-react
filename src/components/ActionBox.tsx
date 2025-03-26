import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit } from '@fortawesome/free-solid-svg-icons'

export default function ActionBox({title, description, x, y}:
    {title:string,description:string, x:number, y:number}) {
    
    return (
        <div className="action">
            <div className="header">
                <span className="title">{title}</span>
                <span className="actions"><a style={{cursor: 'pointer'}}><FontAwesomeIcon icon={faEdit} style={{marginLeft: '-15px', marginTop:'4px'}}/></a></span>
            </div>
            <div className="content">{description}</div>
        </div>
    );
}