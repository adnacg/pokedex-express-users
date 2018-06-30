var React = require('react');
var LayoutContainer = require('./layouts/main.jsx');

class PokemonDetails extends React.Component {
    render() {
        return (
            <div className="pokemonDisplay">
                <img className="pokeImage" src={this.props.pokemon.img} />
                <p className="pokeName"><span className="small">#{this.props.pokemon.num}</span><br/><br/>{this.props.pokemon.name}</p>
                <div className="actionButtonDiv">
                    <form className="actionForm" method="GET" action={"/pokemon/" + this.props.pokemon.id + "/edit"}>
                        <input className="actionButtons" type="submit" value="edit" />
                    </form>
                    <form className="actionForm" method="POST" action={"/pokemon/" + this.props.pokemon.id }>
                        <input type="hidden" name="_method" defaultValue="DELETE" />
                        <input className="actionButtons" type="submit" value="del" />
                    </form>
                </div>
            </div>
        );
    }
}

class Home extends React.Component {
    render() {
        const pokemonDetailsComponentArray = this.props.pokeinfo.map( function(currentPoke) {
            return <PokemonDetails key={currentPoke.id} pokemon={currentPoke} />;
        });
        const isLoggedIn = this.props.cookies.logged_in === 'true';

        return (
            <LayoutContainer messages={this.props.messages}>
                <div className="formDiv">
                    <h1>Welcome To Pokedex!</h1>

                    <form className="sortform" method="GET" action="/">
                        <input type="hidden" name="sortby" defaultValue="name" />

                        <div className="buttonDiv">
                            <input className="sortNameButton" type="submit" value="Sort Pokemons By Name" />
                        </div>
                    </form>
                    <form className="sortform" method="GET" action="/">
                        <input type="hidden" name="sortby" defaultValue="id" />
                        <div className="buttonDiv">
                            <input className="sortIdButton" type="submit" value="Sort Pokemons By ID" />
                        </div>
                    </form>
                    <form className="sortform" method="GET" action="/pokemon/new">
                        <div className="buttonDiv">
                            <input className="createPoke" type="submit" value="Create New Pokemon" />
                        </div>
                    </form>

                    { isLoggedIn ? (
                        <form className="sortform" method="POST" action="/signout">
                            <div className="buttonDiv">
                                <input className="createPoke" type="submit" value="Sign Out" />
                            </div>
                        </form>
                    )  : (
                        [<form className="sortform" method="GET" action="/user/new">
                            <div className="buttonDiv">
                                <input className="createPoke" type="submit" value="Create Account" />
                            </div>
                        </form>,
                        <form className="sortform" method="GET" action="/signin">
                            <div className="buttonDiv">
                                <input className="createPoke" type="submit" value="Sign In" />
                            </div>
                        </form>]
                    )}

                </div>

                <div className="pokemonContainer">
                    {pokemonDetailsComponentArray}
                </div>
            </LayoutContainer>
        );
    }
}

module.exports = Home;