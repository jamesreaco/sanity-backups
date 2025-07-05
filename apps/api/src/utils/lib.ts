export function dateFormatted() {
  const d = new Date()
  let month = `${d.getMonth() + 1}`
  let day = `${d.getDate()}`
  let hour = `${d.getHours()}`
  let minute = `${d.getMinutes()}`
  const year = d.getFullYear()

  if (month.length < 2) month = `0${month}`
  if (day.length < 2) day = `0${day}`
  if (hour.length < 2) hour = `0${hour}`
  if (minute.length < 2) minute = `0${minute}`

  const time = `${hour}:${minute}`

  return [year, month, day, time].join('-')
}

export function slugify(text: string) {
  return text.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '')
}

export function createFilename(projectId: string, dataset: string, projectName: string) {
  const backupDate = dateFormatted()
  return `${slugify(projectName)}-${backupDate}-${dataset}-${projectId}.tar.gz`
}