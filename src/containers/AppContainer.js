import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import Draggable from "react-draggable";
function AppContainer() {
	/* STATE VARIABLES: They will be used to store the user input for conifguration and current elements.  */
	const [elements, setElements] = useState(
		JSON.parse(localStorage.getItem("elements")) || []
	);
	const [isModalHidden, setIsModalHidden] = useState(true);
	const [isEditModalHidden, setIsEditModalHidden] = useState(true);
	const [xPos, setXPos] = useState(0);
	const [yPos, setYPos] = useState(0);
	const [text, setText] = useState("");
	const [fontWeight, setFontWeight] = useState("");
	const [fontSize, setFontSize] = useState("");
	const [id, setId] = useState("");
	const [currentIndex, setCurrentIndex] = useState(-1);
	const [isDragging, setIsDragging] = useState(false);

	/* This function will run when the user drags the element from the sidebar to drop section of the page.*/
	const dragEndSidebar = (event) => {
		/* Getting the boundaries of the drop region so that drop can only be made inside the boundary.*/
		const elem = document.querySelector(".site__page__wrapper");
		let rect = elem.getBoundingClientRect();

		/* Getting the id of the item of the sidebar dragged either: lablel,input or button */
		setId(localStorage.getItem("id"));
		localStorage.removeItem("id");

		/*Checking if the mouse pointer on drag was in the drop zone adjusted with the size of the largest element, input, then run this otherwise go to else. */
		if (
			event.pageX < rect.right - 125 &&
			event.pageX > rect.left &&
			event.pageY < rect.bottom - 10 &&
			event.pageY > rect.top
		) {
			/*This variable will show the initial modal for the config */
			setIsModalHidden(false);

			/* Setting initial co-ordinates variables */
			setXPos(event.pageX - rect.left);
			setYPos(event.pageY - rect.top);
		} else {
			/*Console log out of bounds if cursor was out of the drop zone. */
			console.log("out of bounds");
		}
	};

	/* This method will sork when you will drag a already created element inside the drop zone.
	   This method will also have index of the element being dragged in the elements array to work on the specific element. */
	const dragEndElement = (event, index) => {
		event.preventDefault();

		/* Getting the boundaries of the drop region so that drop can only be made inside the boundary.*/
		const elem = document.querySelector(".site__page__wrapper");
		let rect = elem.getBoundingClientRect();

		/*Checking if the mouse pointer on drag was in the drop zone ,then run this otherwise go to else. */
		if (
			event.pageX < rect.right &&
			event.pageX > rect.left &&
			event.pageY < rect.bottom &&
			event.pageY > rect.top
		) {
			let tempElements = elements;

			let tempElement = { ...tempElements[index] };

			tempElement.transform = "translate(0px)";
			tempElement.xPos = event.pageX - rect.left;
			tempElement.yPos = event.pageY - rect.top;

			tempElements[index] = tempElement;

			localStorage.setItem("elements", JSON.stringify(tempElements));
			setElements(tempElements);
			if (isDragging) {
				setIsDragging(false);
				window.location.reload();
			}
		} else {
			/*Console log out of bounds if cursor was out of the drop zone. */
			console.log("out of bounds");
			window.location.reload();
		}
	};

	/*This method will word when the element drawn is clicked and selected and a key is pressed on it. 
	  It also accepts the index of current element with event.*/
	const handleKeyPress = (e, index) => {
		/* If the key is "Enter" set current index variable to current elemen't variable and open the Edit modal */
		if (e.key === "Enter") {
			setCurrentIndex(index);
			setXPos(elements[index].xPos);
			setYPos(elements[index].yPos);
			setIsEditModalHidden(false);
		} else if (e.keyCode === 46) {
		/* If the key is "Delete" remove the current element with index and update local storage and state variable.*/
			let tempElements = [...elements];

			tempElements.splice(index, 1);
			localStorage.setItem("elements", JSON.stringify(tempElements));
			setElements(tempElements);
		}
	};

	/* This function will be called when cross is clicked on the modal to close it */
	const handleModalClose = (event) => {
		setIsModalHidden(true);
		setIsEditModalHidden(true);

		setCurrentIndex(-1);
		setXPos(0);
		setYPos(0);
		setText("");
		setFontWeight("");
		setFontSize("");
	};

	/* Submit method for the initial modal created by dragging the elements. If user doesn't submit it will not create and element */
	const submitModal = (event) => {
		event.preventDefault();

		/* Creating a new element */
		const newElement = {
			id: id,
			xPos: xPos,
			yPos: yPos,
			text: text,
			fontWeight: fontWeight,
			fontSize: fontSize,
			transform: "translate(0px)",
		};

		const newElements = [...elements, newElement];

		/*Setting up the local storage and changing the state variable for element */
		localStorage.setItem("elements", JSON.stringify(newElements));
		setElements(newElements);

		/*Setting back the state variables */
		setCurrentIndex(-1);
		setXPos(0);
		setYPos(0);
		setText("");
		setFontWeight("");
		setFontSize("");
		setIsModalHidden(true);
	};

	/* This method will be called when we submit the Edit modal conifgurations. */
	const submitEditModal = (event) => {
		event.preventDefault();

		let tempElements = [...elements];

		/*Making changes in the current element*/
		tempElements[currentIndex].xPos = xPos;
		tempElements[currentIndex].yPos = yPos;
		tempElements[currentIndex].text = text;
		tempElements[currentIndex].fontWeight = fontWeight;
		tempElements[currentIndex].fontSize = fontSize;

		localStorage.setItem("elements", JSON.stringify(tempElements));

		setElements(tempElements);

		setCurrentIndex(-1);
		setXPos(0);
		setYPos(0);
		setText("");
		setFontWeight("");
		setFontSize("");

		setIsEditModalHidden(true);
	};

	return (
		<div className="site__container">
			{
				/* Initial modal will be shown when element is dragged from sidebar. */
				isModalHidden ? (
					""
				) : (
					<div className="modal__container">
						<div className="modal__content">
							<div className="modal__heading">
								<h2>Edit Component</h2>
								<span
									className="fa fa-times"
									onClick={handleModalClose}
								></span>
							</div>

							<form onSubmit={submitModal}>
								<div>
									<label for="text">Text</label>
									<br />
									<input
										type="text"
										name="text"
										onChange={(e) =>
											setText(e.target.value)
										}
									/>
								</div>

								<div>
									<label for="X">X</label>
									<br />
									<input
										type="text"
										name="X"
										onChange={(e) =>
											setXPos(e.target.value)
										}
										value={xPos}
									/>
								</div>

								<div>
									<label for="Y">Y</label>
									<br />
									<input
										type="text"
										name="Y"
										onChange={(e) =>
											setYPos(e.target.value)
										}
										value={yPos}
									/>
								</div>

								<div>
									<label for="fontWeight">Font Weight</label>
									<br />
									<input
										type="text"
										name="fontWeight"
										onChange={(e) =>
											setFontWeight(e.target.value)
										}
									/>
								</div>

								<div>
									<label for="fontSize">Font Size</label>
									<br />
									<input
										type="text"
										name="fontSize"
										onChange={(e) =>
											setFontSize(e.target.value)
										}
									/>
								</div>
								<div>
									<button type="submit">Save Changes</button>
								</div>
							</form>
						</div>
					</div>
				)
			}

			{
				/* Edit modal will be shown when already drawn element is dragged. */
				isEditModalHidden ? (
					""
				) : (
					<div className="modal__container">
						<div className="modal__content">
							<div className="modal__heading">
								<h2>Edit Component</h2>
								<span
									className="fa fa-times"
									onClick={handleModalClose}
								></span>
							</div>

							<form onSubmit={submitEditModal}>
								<div>
									<label for="text">Text</label>
									<br />
									<input
										type="text"
										name="text"
										onChange={(e) =>
											setText(e.target.value)
										}
									/>
								</div>

								<div>
									<label for="X">X</label>
									<br />
									<input
										type="text"
										name="X"
										onChange={(e) =>
											setXPos(e.target.value)
										}
										value={xPos}
									/>
								</div>

								<div>
									<label for="Y">Y</label>
									<br />
									<input
										type="text"
										name="Y"
										onChange={(e) =>
											setYPos(e.target.value)
										}
										value={yPos}
									/>
								</div>

								<div>
									<label for="fontWeight">Font Weight</label>
									<br />
									<input
										type="text"
										name="fontWeight"
										onChange={(e) =>
											setFontWeight(e.target.value)
										}
									/>
								</div>

								<div>
									<label for="fontSize">Font Size</label>
									<br />
									<input
										type="text"
										name="fontSize"
										onChange={(e) =>
											setFontSize(e.target.value)
										}
									/>
								</div>
								<div>
									<button type="submit">Save Changes</button>
								</div>
							</form>
						</div>
					</div>
				)
			}

			<div className="site__page__wrapper">
				{
					/* Drawing the elements array by looping over it.*/
					elements.map((element) => {
						const index = elements.indexOf(element);
						if (element.id === "label") {
							return (
								<Draggable
									bounds="parent"
									onStop={(e) => dragEndElement(e, index)}
									onDrag={(e) => setIsDragging(true)}
									onClick={(e) => setIsDragging(false)}
								>
									<div
										style={{
											position: "absolute",
											left: `${element.xPos}px`,
											top: `${element.yPos}px`,
											width: "150px",
											background: "#fff",
											transform: JSON.stringify(
												element.transform
											),
										}}
										onKeyDown={(e) =>
											handleKeyPress(e, index)
										}
									>
										<p
											style={{
												padding: "2px",
												textAlign: "center",
												fontWeight: `${element.fontWeight}`,
												fontSize: `${element.fontSize}px`,
											}}
											tabindex="0"
											className="need__focus"
										>
											{element.text || "This is a label"}
										</p>
									</div>
								</Draggable>
							);
						}
						if (element.id === "input") {
							return (
								<Draggable
									bounds="parent"
									onStop={(e) => dragEndElement(e, index)}
									onDrag={(e) => setIsDragging(true)}
									onClick={(e) => setIsDragging(false)}
								>
									<div
										style={{
											position: "absolute",
											left: `${element.xPos}px`,
											top: `${element.yPos}px`,
											transform: JSON.stringify(
												element.transform
											),
										}}
										onKeyDown={(e) =>
											handleKeyPress(e, index)
										}
									>
										<input
											style={{
												width: "125px",
												fontWeight: `${element.fontWeight}`,
												fontSize: `${element.fontSize}px`,
											}}
											type="text"
											className="need__focus"
											placeholder={element.text || ""}
										/>
									</div>
								</Draggable>
							);
						}
						if (element.id === "button") {
							return (
								<Draggable
									bounds="parent"
									onStop={(e) => dragEndElement(e, index)}
									onDrag={(e) => setIsDragging(true)}
									onClick={(e) => setIsDragging(false)}
								>
									<div
										style={{
											position: "absolute",
											left: `${element.xPos}px`,
											top: `${element.yPos}px`,
											transform: JSON.stringify(
												element.transform
											),
										}}
										onKeyDown={(e) =>
											handleKeyPress(e, index)
										}
									>
										<button
											className="need__focus"
											style={{
												fontWeight: `${element.fontWeight}`,
												fontSize: `${element.fontSize}px`,
											}}
										>
											{element.text || "Button"}
										</button>
									</div>
								</Draggable>
							);
						}
					})
				}
			</div>

			<div className="site__sidebar__wrapper">
				<Sidebar dragEnd={dragEndSidebar} />
			</div>
		</div>
	);
}

export default AppContainer;
