import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit } from '@fortawesome/free-solid-svg-icons'
import './ActionBox.scss';

export default function ActionBox({id, title, description, x, y }:
    { id:string, title: string, description: string, x: number, y: number }) {

    return (
        <div className="action">
            <div className="header">
                <span className="title">{title}</span>
                <span className="actions">
                    <a className="edit" style={{ cursor: 'pointer' }} data-id={id} data-x={x} data-y={y}>
                        <FontAwesomeIcon icon={faEdit} style={{ marginLeft: '-15px', marginTop: '4px' }} data-id={id}/>
                    </a>
                </span>
            </div>
            <div className="content">{description}</div>
        </div>
    );
}