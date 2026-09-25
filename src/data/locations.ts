import viceDocksImg from '../assets/locations/vice-docks.jpg'
import privateYachtImg from '../assets/locations/private-yacht.jpg'
import nightclubImg from '../assets/locations/nightclub.jpg'
import warehouseImg from '../assets/locations/warehouse.jpg'
import downtownImg from '../assets/locations/downtown.jpg'
import casinoFloorImg from '../assets/locations/casino-floor.jpg'
import rooftopPenthouseImg from '../assets/locations/rooftop-penthouse.jpg'

export interface Location {
  id: string
  name: string
  description: string
  imageUrl: string
}

export const LOCATIONS: Location[] = [
  {
    id: 'vice-docks',
    name: 'Vice Docks',
    description:
      'Shipping containers sweating in the humidity, one crane operator working the graveyard shift, one blind spot he never checks.',
    imageUrl: viceDocksImg,
  },
  {
    id: 'private-yacht',
    name: 'Marina Row',
    description:
      'Houseboats and hundred-footers rocking gunwale to gunwale. One gangway in, one guest list you are not on.',
    imageUrl: privateYachtImg,
  },
  {
    id: 'nightclub',
    name: 'Coral Row',
    description:
      'A strip of clubs behind pastel facades, bass loud enough to cover a struggle, strobes dark enough to cover a face.',
    imageUrl: nightclubImg,
  },
  {
    id: 'warehouse',
    name: 'Everglade Yard',
    description:
      'A cargo yard where the swamp starts. Airboats out back, off the books, off the grid, off-limits after hours.',
    imageUrl: warehouseImg,
  },
  {
    id: 'downtown',
    name: 'Ocean Drive',
    description:
      'Neon on wet asphalt, art-deco fronts lit up pink and teal. Cameras on every corner, traffic that never fully stops.',
    imageUrl: downtownImg,
  },
  {
    id: 'casino-floor',
    name: 'Flamingo Casino',
    description:
      'A beachfront casino floor with eyes in every ceiling tile. The house always watches, and the house is close to the water.',
    imageUrl: casinoFloorImg,
  },
  {
    id: 'rooftop-penthouse',
    name: 'Sunset Tower',
    description:
      'A beachfront high-rise, top floor, one elevator up. One way down if it goes wrong.',
    imageUrl: rooftopPenthouseImg,
  },
]
