// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import * as React from 'react'
// 🐨 you'll want the following additional things from '../pokemon':
// fetchPokemon: the function we call to get the pokemon info
// PokemonInfoFallback: the thing we show while we're loading the pokemon info
// PokemonDataView: the stuff we use to display the pokemon info
import {
  fetchPokemon,
  PokemonInfoFallback,
  PokemonDataView,
  PokemonForm,
} from '../pokemon'

import {ErrorBoundary} from 'react-error-boundary'

function ErrorFallback({error, resetErrorBoundary}) {
  return (
    <div role="alert">
      There was an error:{' '}
      <pre style={{whiteSpace: 'normal'}}>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  )
}

function PokemonInfo({pokemonName}) {
  // 🐨 Have state for the pokemon (null)
  const [state, setState] = React.useState({
    pokemon: null,
    error: null,
    status: pokemonName ? 'pending' : 'idle',
  })
  console.log(state)
  const {pokemon, error, status} = state
  // 🐨 use React.useEffect where the callback should be called whenever the
  // pokemon name changes.
  React.useEffect(() => {
    if (!pokemonName) return
    setState({status: 'pending'})
    fetchPokemon(pokemonName)
      .then(pokemonData => {
        setState({pokemon: pokemonData, status: 'resolved'})
      })
      .catch(error => {
        setState({error, status: 'rejected'})
      })
  }, [pokemonName])

  switch (status) {
    case 'idle': {
      return 'Submit a pokemon'
    }
    case 'pending': {
      return <PokemonInfoFallback name={pokemonName} />
    }
    case 'resolved': {
      return <PokemonDataView pokemon={pokemon} />
    }
    case 'rejected': {
      throw error
    }
  }
}

function App() {
  const [pokemonName, setPokemonName] = React.useState('')

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName)
  }

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
        <ErrorBoundary
          FallbackComponent={ErrorFallback}
          onReset={() => {
            setPokemonName('')
          }}
          resetKeys={[pokemonName]}
        >
          <PokemonInfo pokemonName={pokemonName} />
        </ErrorBoundary>
      </div>
    </div>
  )
}

export default App
