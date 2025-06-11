export function dateFormatted() {
  const d = new Date()
  let month = `${d.getMonth() + 1}`
  let day = `${d.getDate()}`
  const year = d.getFullYear()

  if (month.length < 2) month = `0${month}`
  if (day.length < 2) day = `0${day}`

  return [year, month, day].join('-')
}

export function createFilename(projectId: string, dataset: string) {
  const today = dateFormatted()
  return `${projectId}-${dataset}-${today}.tar.gz`
}