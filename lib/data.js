import fs from 'fs'
import path from 'path'


const dataDirectory = path.join(process.cwd(), 'data')
console.log('data directory: ', dataDirectory)

export function getData() {
  const fileNames = fs.readdirSync(dataDirectory)
  let data = {}
  let file
  for (file of fileNames) {
    const fullPath = path.join(dataDirectory, file)
    const name = file.replace(/\.json$/, '')
    const fileContents = fs.readFileSync(fullPath, 'utf8')
    const parsedFileContent = JSON.parse(fileContents)
    data[name] = parsedFileContent
  }
  return data;
}

export function getAllArticleIds() {
  const fileNames = fs.readdirSync(dataDirectory)

  // Returns an array that looks like this:
  // [
  //   {
  //     params: {
  //       id: 'ssg-ssr'
  //     }
  //   },
  //   {
  //     params: {
  //       id: 'pre-rendering'
  //     }
  //   }
  // ]
  return fileNames.map(fileName => {
    return {
      params: {
        id: fileName.replace(/\.json$/, '')
      }
    }
  })
}

export async function getArticleData(id) {
  const fullPath = path.join(dataDirectory, `${id}.json`)
  const fileContents = fs.readFileSync(fullPath, 'utf8')

  console.log('file contents (getArticleData): ', fileContents);

  // Use remark to convert markdown into HTML string
  // const processedContent = await remark()
  //   .use(html)
  //   .process(matterResult.content)
  // const contentHtml = processedContent.toString()

  // Combine the data with the id
  return {
    id,
    fileContents,
    // ...matterResult.data
  }
}