import React, { useState } from 'react'
import { gql, useMutation } from '@apollo/client'
import {EDIT_AUTHOR} from '../queries'

const Authors = (props) => {

  const authors = props.authors.data.allAuthors

  const [author, setAuthor] = useState(authors[0].name)
  const [birthyear, setBirthYear] = useState("")

  console.log(authors)

  const [updateAuthor] = useMutation(EDIT_AUTHOR,  {
    onError: (error) => {
      props.setError(error.graphQLErrors[0].message)
    }
  })

  if (!props.show) {
    return null
  }

  console.log(author, birthyear)

  const submit = async (event) => {
    event.preventDefault()

    updateAuthor({ variables: {name: author.toString(), born: birthyear } })
    setAuthor("")
    setBirthYear("")
  }

  const authorForm = () => {
    return (
      <div>
        <h2> Set birthyear </h2>

        <form onSubmit={submit}>

          <select onChange={ ({ target }) => setAuthor(target.value)}>
            {authors.map(a =>
              <option value={a.name}>{a.name}</option>
            )}
          </select>

          <br/>
          born <input value={birthyear} onChange={({ target }) => setBirthYear(target.value)}/>
          <br/>
          <button type="submit">update author</button>
        </form>
      </div>
    )
  }

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>
              born
            </th>
            <th>
              books
            </th>
          </tr>
          {authors.map(a =>
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          )}
        </tbody>
      </table>

      {authorForm()}

    </div>
  )
}

export default Authors
