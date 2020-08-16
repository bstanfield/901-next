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

export function getAllCocktailNames() {
  const fullPath = path.join(dataDirectory, 'cocktails.json')
  const fileContents = fs.readFileSync(fullPath, 'utf8')
  const parsedFileContent = JSON.parse(fileContents)
  return parsedFileContent.map(cocktail => (
    { params: { name: cocktail.name } }
  ))
}

export function getCocktailData(name) {
  const fullPath = path.join(dataDirectory, 'cocktails.json')
  const fileContents = fs.readFileSync(fullPath, 'utf8')
  const parsedFileContent = JSON.parse(fileContents)
  return parsedFileContent.filter(cocktail => cocktail.name.toLowerCase() === name.toLowerCase())
}