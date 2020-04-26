import React, { useState, useEffect } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import { gql, useQuery, useApolloClient, useLazyQuery } from '@apollo/client'
import LoginForm from './components/LoginForm'
import Recommendations from './components/Recommendations'

const ALL_BOOKS = gql`
  query {
    allBooks  {
      title,
      author {
        name
        bookCount
      },
      published,
      genres
    }
  }
`
const ALL_AUTHORS = gql`
  query {
    allAuthors {
      name,
      born,
      bookCount
    }
  }
`
const GET_USER = gql`
  query {
    me {
      username
      favoriteGenre
    }
  }
`

const App = () => {
  const [token, setToken] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem('library-user-token')
    if ( token ) {
      setToken(token)
    }
  }, [])

  const {loading, error, data, refetch, networkStatus} = useQuery(GET_USER, {
    notifyOnNetworkStatusChange: true,
  })

  const refetchUser = () => {
    refetch()
  }

  console.log("TOKEN", token)
  console.log("USER", data)

  const [errorMessage, setErrorMessage] = useState(null)

  const notify = (message) => {
    setErrorMessage(message)
    setTimeout(() => {
      setErrorMessage(null)
    }, 5000)
  }

  const books = useQuery(ALL_BOOKS, {
    pollInterval: 2000
  })
  const authors = useQuery(ALL_AUTHORS, {
    pollInterval: 2000
  })
  const client = useApolloClient()

  const [page, setPage] = useState('authors')

  if (networkStatus === 4) return 'Logging in...!';


  if (loading || authors.loading || books.loading)  {
    return <div>loading...</div>
  }

  const Notify = ({errorMessage}) => {
    if ( !errorMessage ) {
      return null
    }
    return (
      <div style={{color: 'red'}}>
        {errorMessage}
      </div>
    )
  }

  if (!token) {
    return (
      <div>
        <Notify errorMessage={errorMessage}/>
        <h2>Login </h2>
        <LoginForm setToken={setToken} setError={notify} getUser={refetchUser}/>
      </div>
    )
  }

  const logout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
  }
  return (
    <div>
      <div>
        <Notify errorMessage={errorMessage}/>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        <button onClick={() => setPage('add')}>add book</button>
        <button onClick={() => setPage('recommendations')}>recommendations</button>
      </div>

      {token ? <button onClick={logout}> logout </button> : <div> </div>}

      <Authors
        show={page === 'authors'}
        authors={authors}
        setError={notify}
      />

      <Books
        show={page === 'books'}
        books={books}
      />

      <Recommendations show={page === "recommendations"} books={books} user={data}/>

      <NewBook
        show={page === 'add'}
        setError={notify}
      />

    </div>
  )
}

export default App
