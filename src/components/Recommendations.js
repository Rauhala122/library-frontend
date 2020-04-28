import React, { useState } from 'react'
import { gql, useMutation, useQuery } from '@apollo/client'
import '../index.css';

const Recommendations = (props) => {

  const user = props.user.me
  console.log(user)
  const [books, setBooks] = useState(props.books.data.allBooks.filter(b => b.genres.includes(user.favoriteGenre)))

  if (!props.show) {
    return null
  }

  return (
    <div>
      <h2>Book recommendations for {user.username}</h2>
      <p> Books in your favorite genre <strong>{user.favoriteGenre}</strong></p>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>
              author
            </th>
            <th>
              published
            </th>
          </tr>
          {books.map(a =>
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
              {a.genres.join(" ")}
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export default Recommendations
