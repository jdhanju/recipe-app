import { React, useState } from 'react';
import ReactModal from 'react-modal';




function handleDeleteClick(recipeName, recipes, setRecipes) {

  //delete from server
  fetch(`http://localhost:8080/delete-recipe/${encodeURIComponent(recipeName)}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(response => {
      if (response.ok) {
        console.log('Recipe deleted successfully!');
      } else {
        throw new Error('Failed to delete recipe.');
      }
    })
    .catch(error => {
      console.error(error);
    });

  //trigger render
  const updatedRecipes = recipes.filter(recipe => recipe.name !== recipeName);
  setRecipes(updatedRecipes);
}

const RecipeList = ({ recipes, setRecipes, update, setUpdate }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [contentModal, setContentModal] = useState({});
  const [name, setName] = useState('');
  const [directions, setDirections] = useState('');
  const [ingredients, setIngredients] = useState('');

  function handleCloseModal() {
    setModalOpen(false);
  }

  function handleRceipeClick(recipe, setModalOpen, setContentModal) {
    setModalOpen(true);
    setContentModal(recipe);
    setName(recipe.name);
    setIngredients(recipe.ingredient);
    setDirections(recipe.directions);
  }

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleDirectionsChange = (e) => {
    setDirections(e.target.value);
  };

  const handleIngredientsChange = (e) => {
    setIngredients(e.target.value);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    // Perform any necessary logic with the updated name, directions, and ingredients values
    console.log('Name:', name);
    console.log('Directions:', directions);
    console.log('Ingredients:', ingredients);

    try {
      await fetch(`http://localhost:8080/update-recipe/${encodeURIComponent(name)}/${encodeURIComponent(ingredients)}/${encodeURIComponent(directions)}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      //console.log(await response.json());
    } catch (error) {
      console.log(error);
    }

    const updatedRecipes = recipes.map((recipe) => {
      if (recipe.name === name) {
        recipe.ingredient = ingredients;
        recipe.directions = directions;
        return { ...recipe };
      }
      return recipe;
    });

    setRecipes(updatedRecipes);
    //setUpdate(!update);
    handleCloseModal();
  };


  return (
    <div className='list'>
      <h2>Recipe List</h2>
      <p>(click on name)</p>
      {recipes.map((recipe, index) => (
        <div className='recipe-row' key={index}>
          <h3 className="recipeName" onClick={() => handleRceipeClick(recipe, setModalOpen, setContentModal)}>{recipe.name}</h3>
          <button className='deleteButton' onClick={() => { handleDeleteClick(recipe.name, recipes, setRecipes) }}>Delete</button>
        </div>
      ))}


      <ReactModal

        onRequestClose={handleCloseModal}

        isOpen={
          modalOpen
  /* Boolean describing if the modal should be shown or not. */}


        closeTimeoutMS={
          0
  /* Number indicating the milliseconds to wait before closing
     the modal. */}

        style={
          {
            overlay: {
              backgroundColor: 'grey',
              position: 'fixed',
              top: 350,
              left: 300,
              right: 500,
              bottom: 100,
            },
            content: {

              position: 'absolute',
              top: '5px',
              left: '5px',
              right: '5px',
              bottom: '5px',
              border: '1px solid #ccc',
              background: '#fff',
              overflow: 'auto',
              WebkitOverflowScrolling: 'touch',
              borderRadius: '4px',
              outline: 'none',
              padding: '20px'
            },
          }
  /* Object indicating styles to be used for the modal.
     It has two keys, `overlay` and `content`.
     See the `Styles` section for more details. */}

        contentLabel={
          "Example Modal"
  /* String indicating how the content container should be announced
     to screenreaders */}

        portalClassName={
          "ReactModalPortal"
  /* String className to be applied to the portal.
     See the `Styles` section for more details. */}

        overlayClassName={
          "ReactModal__Overlay"
  /* String className to be applied to the overlay.
     See the `Styles` section for more details. */}

        id={
          "some-id"
  /* String id to be applied to the content div. */}

        className={
          "ReactModal__Content"
  /* String className to be applied to the modal content.
     See the `Styles` section for more details. */}

        bodyOpenClassName={
          "ReactModal__Body--open"
  /* String className to be applied to the modal ownerDocument.body
     (must be a constant string).
     This attribute when set as `null` doesn't add any class
     to document.body.
     See the `Styles` section for more details. */}

        htmlOpenClassName={
          "ReactModal__Html--open"
  /* String className to be applied to the modal ownerDocument.html
     (must be a constant string).
     This attribute is `null` by default.
     See the `Styles` section for more details. */}

        ariaHideApp={
          true
  /* Boolean indicating if the appElement should be hidden */}

        shouldFocusAfterRender={
          true
  /* Boolean indicating if the modal should be focused after render. */}

        shouldCloseOnOverlayClick={
          true
  /* Boolean indicating if the overlay should close the modal */}

        shouldCloseOnEsc={
          true
  /* Boolean indicating if pressing the esc key should close the modal
     Note: By disabling the esc key from closing the modal
     you may introduce an accessibility issue. */}

        shouldReturnFocusAfterClose={
          true
  /* Boolean indicating if the modal should restore focus to the element
     that had focus prior to its display. */}

        role={
          "dialog"
  /* String indicating the role of the modal, allowing the 'dialog' role
     to be applied if desired.
     This attribute is `dialog` by default. */}

        preventScroll={
          false
  /* Boolean indicating if the modal should use the preventScroll flag when
     restoring focus to the element that had focus prior to its display. */}

        parentSelector={
          () => document.body
  /* Function that will be called to get the parent element
     that the modal will be attached to. */}

        aria={
          {
            labelledby: "heading",
            describedby: "full_description"
          }
  /* Additional aria attributes (optional). */}

        data={
          { background: "green" }
  /* Additional data attributes (optional). */}

        testId={
          ""
  /* String testId that renders a data-testid attribute in the DOM,
    useful for testing. */}

        // overlayRef={
        //   setOverlayRef
        // /* Overlay ref callback. */}

        // contentRef={
        //   setContentRef
        // /* Content ref callback. */}

        overlayElement={
          (props, contentElement) => <div {...props}>{contentElement}</div>
  /* Custom Overlay element. */}

        contentElement={
          (props, children) => <div {...props}>{children}</div>
  /* Custom Content element. */}
      >
        <form className="editForm" onSubmit={handleFormSubmit}>
          <h4>Name:</h4>
          <input
            type="text"
            value={name}
            onChange={handleNameChange}
            placeholder="Name"
          />
          <h4>Ingredients:</h4>
          <textarea
            value={ingredients}
            onChange={handleIngredientsChange}
            placeholder="Ingredients"
          ></textarea>
          <h4>Directions:</h4>
          <textarea
            value={directions}
            onChange={handleDirectionsChange}
            placeholder="Directions"
          ></textarea>
          <h4>Last Modified:</h4>
          <p>{contentModal.timelastmodified}</p>
          <button type="submit">Save</button>
        </form>
        <button onClick={handleCloseModal}>Close Modal</button>
      </ReactModal>
    </div>
  );
};

export default RecipeList;
