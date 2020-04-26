import React, { useState, useEffect } from 'react'
import '../index.css';

const Books = (props) => {

  const [genre, setGenre] = useState("")
  console.log(genre)
  const [books, setBooks] = useState(props.books.data.allBooks)

  useEffect(() => {
    if (genre !== "") {
      setBooks(books.filter(b => b.genres.includes(genre)))
    } else {
      setBooks(props.books.data.allBooks)
    }
  }, [genre])

  if (!props.show) {
    return null
  }

  let genres = []

  books.forEach((book) => {
    book.genres.forEach(genre => {
      if (!genres.includes(genre)) {
        genres.push(genre)
      }
    })
  })

  return (
    <div>
      <h2>books</h2>

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
      <button className={genre === "" ? "selectedGenre" : ""} value="" onClick={() => setGenre("")}>All</button>
      {genres.map(g => {
          if (g !== null && g !== "" && g !== undefined) {
            return <button value={g} className={genre === g ? "selectedGenre" : ""} onClick={({ target }) => setGenre(target.value)}>{g}</button>
          }
        }
      )}
    </div>
  )
}

export default Books
