
export default function Categories({ categories, setFilter }) {
  return (
    categories.map((category, index) => (<a onClick={() => setFilter(category.lists)}><span key={index} className="categoryButton">{category.name}</span></a>))
  )
}