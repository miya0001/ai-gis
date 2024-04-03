export const getYears = () => {
  const today = new Date()
  let year = today.getFullYear()
  const month = today.getMonth()

  if (month < 3) {
    year = year - 1
  }

  const thisYear = new Date(year, month, 1)
  const nextYear = new Date(year + 1, month, 1)

  return [
    thisYear.toLocaleString('ja-JP-u-ca-japanese', {era: 'short', year: 'numeric'}) + '度',
    nextYear.toLocaleString('ja-JP-u-ca-japanese', {era: 'short', year: 'numeric'}) + '度',
  ]
}
