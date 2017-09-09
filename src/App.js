import React, { Component } from 'react';
import './App.css';

const recipes = [
  {
    recipe_name: 'PB & J',
    ingredients: ['peanut', 'butter', 'jelly', 'bread']
  },
  {
    recipe_name: 'egg salad',
    ingredients: ['hard boiled eggs', 'mayo', 'paprika']
  },
  {
    recipe_name: 'guacamole',
    ingredients: ['avocado', 'onion', 'cilantro', 'lime juice']
  }
]


let allRecipes = recipes;

if (localStorage["recipes"] != undefined) {
  allRecipes = allRecipes.concat(JSON.parse(localStorage["recipes"]));
} else {
  localStorage.setItem("recipes", JSON.stringify([]));
}

class RecipeInput extends Component {
  constructor(props) {
    super(props);

    this.handleRecipeChange = this.handleRecipeChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.state = {
      recipe_name: '',
      ingredients: []
    }
  }
  handleRecipeChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: name == "ingredients" ? value.split(",") : value
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    this.props.onAddRecipe(this.state);

    this.setState({
      recipe_name: '',
      ingredients: []
    })
  }
  render() {
    return (
      <div className="box input-box">
        <form onSubmit={this.handleSubmit} className="recipe-form">
          <label htmlFor="inputRecipeName" className="label-control" placeholder="Name" >Recipe Name</label><br />
          <input type="text" name="recipe_name" className="input-control" value={this.state.recipe_name} onChange={this.handleRecipeChange}></input><br />
          <label htmlFor="inputIngredients" className="label-control" placeholder="Ingredients"> Ingredients</label><br />
          <textarea type="text" rows="3" name="ingredients" className="input-control" value={this.state.ingredients} onChange={this.handleRecipeChange}></textarea><br />
          <button type="submit">Add Recipe</button>
        </form>
      </div>
    )
  }
}


class RecipeCard extends Component {
  constructor(props) {
    super(props);
    this.handleAddRecipe = this.handleAddRecipe.bind(this);
    this.handleChange = this.handleChange.bind(this);


    // let localRecipes = localStorage.getItem(JSON.parse("recipes"));
    let recipes = allRecipes;
    this.state = {
      recipes
    }
  }
  handleAddRecipe(recipe) {
    let localRecipes = JSON.parse(localStorage['recipes']);
    localRecipes.push(recipe);
    localStorage.setItem("recipes", JSON.stringify(localRecipes));
    this.setState({
      recipes: [...this.state.recipes, recipe]
    });
  }
  handleRemoveRecipe(index) {
    let localRecipes = JSON.parse(localStorage['recipes']).filter((e, i) => i != index - 3);

    console.log(localRecipes);
    localStorage.setItem("recipes", JSON.stringify(localRecipes));
    this.setState({
      recipes: this.state.recipes.filter((e, i) => i !== index)
    })
  }

  handleChange(e, index, key) {
    const name = e.target.name;
    const value = e.target.value;
    const recipe = this.state.recipes[index];
    const ingredients = recipe.ingredients;
    recipe.ingredients.splice(key, 1, value);
    // const key = recipe.ingredients.indexOf(name);

    // take a copy of that fish and update it with the new data
    console.log('name: ' + name + ' key: ' + key + ' value: ' + value);
    // console.log(recipe.ingredients.splice(key, 1, value));
    const updatedRecipe = {
      ...recipe,
      [name]: name == "ingredients" ? ingredients : e.target.value
    }

    console.log("updatedRecipe: " + updatedRecipe);
    const recipes = [...this.state.recipes];

    console.log("recipes[index]: " + recipes[index]);


    recipes[index] = updatedRecipe;

    let localRecipes = JSON.parse(localStorage['recipes']);
    localRecipes[index - 3] = updatedRecipe;

    localStorage.setItem("recipes", JSON.stringify(localRecipes));
    this.setState({ recipes });

  }


  render() {
    return (
      <div className="box rcard">
        <RecipeInput onAddRecipe={this.handleAddRecipe} />
        <div className='box box-recipe'>
          {this.state.recipes.map((recipe, index) =>
            <div className="recipe" key={index}>
              <h3>RECIPE NAME <span>👨🏻‍🍳</span><br />
                <input className="recipe-name" type="text" name="recipe_name" value={recipe.recipe_name} placeholder="Recipe Name" onChange={(e) => this.handleChange(e, index)} />
              </h3>
              <br />
              <h3 className="recipe-divider"><span>INGREDIENTS 🍽</span></h3>
              {recipe.ingredients.map((ingredient, key) =>
                <input className="ingredients" key={key} type="text" name="ingredients" value={ingredient} placeholder="Ingredients" onChange={(e) => this.handleChange(e, index, key)} />
              )
              }
              <br />

              < button className="btn" onClick={this.handleRemoveRecipe.bind(this, index)} >
                <span className="delete-icon" role="img" aria-label="Remove" >❌</span>
              </button>

            </div>
          )
          }
        </div>
      </div >
    )
  }
}

class App extends Component {
  render() {
    return (
      <div className="App">
        <h1><span>🌶 MY RECIPE BOOK 🥑</span></h1>
        <RecipeCard />
      </div>
    );
  }
}

export default App;
