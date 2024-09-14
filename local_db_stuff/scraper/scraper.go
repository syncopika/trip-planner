// scraper to get trip destination data to populate the database with

package main

import (
  "encoding/csv"
	"fmt"
  "log"
  "os"
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

func (d Destination) asCsvRow() []string {
  return []string{d.Name, d.Country, d.Category, strconv.FormatFloat(float64(d.Latitude), 'E', -1, 32), strconv.FormatFloat(float64(d.Longitude), 'E', -1, 32),}
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
  
  // set up csv file to write to
  file, err := os.Create("data.csv")
  if err != nil {
    panic(err)
  }
  
  // something to think about: https://news.ycombinator.com/item?id=41479283
  defer file.Close()
  
  w := csv.NewWriter(file)
  
  // write column headers to csv
  csvHeaders := []string{"name", "country", "category", "latitude", "longitude",}
  
  if err := w.Write(csvHeaders); err != nil {
    log.Fatalln("error writing record to csv: ", err)
  }
  
  c.OnHTML("tr", func(tr *colly.HTMLElement) {
    if tr.Index > 1 {
    
      var dest Destination
      
      tr.ForEach("td", func(i int, td *colly.HTMLElement) {
        if i == 1 {
          // name of place
          dest.Name = td.ChildText("a")
        } else if i == 2 {
          // name of the country the place is in
          dest.Country = td.ChildText("a")
        } else if i == 3 {
          // the place category
          dest.Category = td.Text
        } else if i == 4 {
          // the latitude
          latitudeComponents := geoCoordRegex.FindAllString(td.Text, 3)
          latDec := convertCoordinatesToDecimal(stringSliceToInt(latitudeComponents))
          dest.Latitude = latDec
        } else if i == 5 {
          // the longitude
          longitudeComponents := geoCoordRegex.FindAllString(td.Text, 3)
          lngDec := convertCoordinatesToDecimal(stringSliceToInt(longitudeComponents))
          dest.Longitude = lngDec
        }
      })
      
      if dest.Name != "" {
        //dest.print()
        
        // add to csv
        if err := w.Write(dest.asCsvRow()); err != nil {
          log.Fatalln("error writing record to csv: ", err)
        }
      }
      
    }
  })
  
  c.OnRequest(func(req *colly.Request) {
    fmt.Println("visiting ", req.URL.String())
  })
  
  c.Visit("https://www.geonames.org/advanced-search.html?q=museum&country=TW")
  c.Visit("https://www.geonames.org/advanced-search.html?q=park&country=TW")
  c.Visit("https://www.geonames.org/advanced-search.html?q=hotel&country=TW")
  c.Visit("https://www.geonames.org/advanced-search.html?q=museum&country=GB")
  c.Visit("https://www.geonames.org/advanced-search.html?q=park&country=GB")
  c.Visit("https://www.geonames.org/advanced-search.html?q=restaurant&country=GB")
  c.Visit("https://www.geonames.org/advanced-search.html?q=mall&country=GB")
  c.Visit("https://www.geonames.org/advanced-search.html?q=restaurant&country=US")
  c.Visit("https://www.geonames.org/advanced-search.html?q=hotel&country=US")
  c.Visit("https://www.geonames.org/advanced-search.html?q=museum&country=US")
  c.Visit("https://www.geonames.org/advanced-search.html?q=park&country=US")
  c.Visit("https://www.geonames.org/advanced-search.html?q=park&country=SG")
  c.Visit("https://www.geonames.org/advanced-search.html?q=park&country=SG")
  c.Visit("https://www.geonames.org/advanced-search.html?q=mall&country=SG")
  
  w.Flush()
  
  if err := w.Error(); err != nil {
    log.Fatal(err)
  }
  
  fmt.Println("done!")
}