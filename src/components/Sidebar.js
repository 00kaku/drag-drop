import Draggable from "react-draggable";
import "./Sidebar.css";

function Sidebar({ dragEnd }) {
	const dragStart = (event, id) => {
		localStorage.setItem("id", id);
	};

	return (
		<div className="sidebar">
			<h2 className="sidebar__heading">BLOCKS</h2>
			<Draggable
				onStop={dragEnd}
				onStart={(event) => dragStart(event, "label")}
				position={{ x: 0, y: 0 }}
			>
				<div className="element__wrapper">
					<span className="fa fa-clone"></span>
					<h4 className="element__name">Label</h4>
				</div>
			</Draggable>
			<Draggable
				onStart={(event) => dragStart(event, "input")}
				onStop={dragEnd}
				position={{ x: 0, y: 0 }}
			>
				<div className="element__wrapper">
					<span className="fa fa-clone"></span>
					<h4 className="element__name">Input</h4>
				</div>
			</Draggable>
			<Draggable
				onStop={dragEnd}
				onStart={(event) => dragStart(event, "button")}
				position={{ x: 0, y: 0 }}
			>
				<div className="element__wrapper">
					<span className="fa fa-clone"></span>
					<h4 className="element__name">Button</h4>
				</div>
			</Draggable>
		</div>
	);
}

export default Sidebar;
