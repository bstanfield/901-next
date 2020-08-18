import fs from 'fs'
import path from 'path'

const dataDirectory = path.join(process.cwd(), 'data')

export function getData() {
  const fileNames = fs.readdirSync(dataDirectory)
  let data = {}
  for (const file of fileNames) {
    const fullPath = path.join(dataDirectory, file)
    const name = file.replace(/\.json$/, '')
    const fileContents = fs.readFileSync(fullPath, 'utf8')
    const parsedFileContent = JSON.parse(fileContents)
    data[name] = parsedFileContent;
  }
  return data
}

// can delete later
export const createCocktailId = () => {
  const fullPath = path.join(dataDirectory, 'cocktails.json')
  const fileContents = fs.readFileSync(fullPath, 'utf8')
  const parsedFileContent = JSON.parse(fileContents)
  const cocktailsWithIds = parsedFileContent.map((cocktail) => {
    const id = cocktail.name.split(' ').join('_').toLowerCase().replace(/[.,\/#$%\^&\*;:{}=\-’'`~()]/g, "").normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    return { ...{ id: id }, ...cocktail }
  })
  return cocktailsWithIds
}