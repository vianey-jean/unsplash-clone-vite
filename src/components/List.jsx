import { useState, useEffect, useRef } from "react"
import spinner from "../assets/spinner.svg"
import usePhotos from "../hooks/usePhotos"

export default function List() {
  const [query, setQuery] = useState("random")
  const [pageNumber, setPageNumber] = useState(1)
  const lastPicRef = useRef()
  const searchRef = useRef()

  const photosApiData = usePhotos(query, pageNumber)

  useEffect(() => {
    if (lastPicRef.current) {
      const observer = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting && photosApiData.maxPages !== pageNumber) {
          setPageNumber(pageNumber + 1)
          lastPicRef.current = null
          observer.disconnect()
        }
      })

      observer.observe(lastPicRef.current)
    }
  }, [photosApiData])

  function handleSubmit(e) {
    e.preventDefault()
    if (searchRef.current.value !== query) {
      setQuery(searchRef.current.value)
      setPageNumber(1)
    }
  }

  return (
    <>
      <h1 className="text-6xl text-red-800"> Cloneur Unsplash </h1>
      <form onSubmit={handleSubmit}>
        <label className="text-2xl text-green-600 block mb-4 mt-6" htmlFor="search">
        Recherche des images dans le banque d'images ...
        </label>
        <input
          ref={searchRef}
          placeholder="Look for something..."
          className="block w-full mb-14 text-slate-800 py-3 px-2 text-md outline-gray-500 rounded border border-slate-400"
          type="text"
        />
      </form>
      {/* Affichage erreur */}
      {photosApiData.error.state && <p>{photosApiData.error.msg}</p>}

      {/* Pas d'erreur mais pas de résultat */}
      {photosApiData.photos.length === 0 &&
        !photosApiData.error.state &&
        !photosApiData.loading && <p>Aucune image disponible pour cette requête</p>}

      <ul className="grid grid-cols-[repeat(auto-fill,minmax(250px,_1fr))] auto-rows-[200px] gap-4 justify-center">
        {!photosApiData.loader &&
          photosApiData.photos.length !== 0 &&
          photosApiData.photos.map((photo, index) => {
            if (photosApiData.photos.length === index + 1) {
              return (
                <li ref={lastPicRef} key={photo.id}>
                  <img
                    className="w-full h-full object-cover"
                    src={photo.urls.regular}
                    alt={photo.alt_description}
                  />
                </li>
              )
            } else {
              return (
                <li key={photo.id}>
                  <img
                    className="w-full h-full object-cover"
                    src={photo.urls.regular}
                    alt={photo.alt_description}
                  />
                </li>
              )
            }
          })}
      </ul>

      {/* Loader */}
      {photosApiData.loading && !photosApiData.error.state && (
        <img className="block mx-auto" src={spinner} />
      )}

      {/* Quand on atteint la dernière page */}
      {photosApiData.maxPages === pageNumber && <p className="mt-10">Il n'y a plus d'images à afficher pour cette requête.</p>}
    </>
  )
}
