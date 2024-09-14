// scraper to get trip destination data to populate the database with

package main

import (
	"fmt"
  "regexp"
  "strconv"

	"github.com/gocolly/colly/v2"
)

type Destination struct {
  Name string
  Country string
  Category string
  Latitude float32
  Longitude float32
}

func (d Destination) print() {
  fmt.Printf("%s, %s, lat: %f, lng: %f \n", d.Name, d.Country, d.Latitude, d.Longitude)
}

// convert []string to []int
func stringSliceToInt(strings []string) []int {
  ints := make([]int, len(strings))
  for i, str := range strings {
    integer, err := strconv.Atoi(str)
    if err != nil {
      // TODO: propagate error?
      fmt.Println("could not get int from str: ", str)
    }
    ints[i] = integer
  }
  return ints;
}

// convert geographic coordinates (lat and lng) to decimal
func convertCoordinatesToDecimal(components []int) float32 {
  // TODO: if len(components) != 3, error
  degrees := float32(components[0])
  hours := float32(components[1])
  minutes := float32(components[2])
  return (hours / 60.0) + (minutes / 3600.0) + degrees
}

func main() {
  fmt.Println("starting...")
  
  c := colly.NewCollector()
  
  geoCoordRegex := regexp.MustCompile(`(\d+)`)
  
  c.OnHTML("tr", func(tr *colly.HTMLElement) {
    if tr.Index > 1 {
    
      var dest Destination
    
      tr.ForEach("td", func(i int, td *colly.HTMLElement) {
        if i == 1 {
          // name of place
          place := td.ChildText("a")
          dest.Name = place
          //fmt.Println("place: ", place)
        } else if i == 2 {
          // name of the country the place is in
          country := td.ChildText("a")
          dest.Country = country
          //fmt.Println("country: ", country)
        } else if i == 3 {
          // the place category
          category := td.Text
          dest.Category = category
          //fmt.Println("category: ", category)
        } else if i == 4 {
          // the latitude
          latitude := td.Text
          latitudeComponents := geoCoordRegex.FindAllString(latitude, 3)
          latDec := convertCoordinatesToDecimal(stringSliceToInt(latitudeComponents))
          dest.Latitude = latDec
          //fmt.Println("latitude: ", latDec)
        } else if i == 5 {
          // the longitude
          longitude := td.Text
          longitudeComponents := geoCoordRegex.FindAllString(longitude, 3)
          lngDec := convertCoordinatesToDecimal(stringSliceToInt(longitudeComponents))
          dest.Longitude = lngDec
          //fmt.Println("longitude: ", lngDec)
        }
      })
      
      if dest.Name != "" {
        dest.print()
      }
      
      // TODO: add to csv
    }
  })
  
  c.OnRequest(func(req *colly.Request) {
    fmt.Println("visiting ", req.URL.String())
  })
  
  c.Visit("https://www.geonames.org/advanced-search.html?q=museum&country=TW")
  c.Visit("https://www.geonames.org/advanced-search.html?q=park&country=TW")
}