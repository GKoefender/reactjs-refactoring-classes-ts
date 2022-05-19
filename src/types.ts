export interface foodProps {
  id: number,
  name: string,
  description: string,
  price: number,
  available: boolean,
  image: string
}

export type foodInputProps = Omit<foodProps, 'id' | 'available'>