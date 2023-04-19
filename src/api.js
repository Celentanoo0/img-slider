export const getImages = async () => {
  try {
    const f = await fetch('https://picsum.photos/v2/list/')
    return await f.json()
  } catch (error) {
    console.error(error)
  }
}
