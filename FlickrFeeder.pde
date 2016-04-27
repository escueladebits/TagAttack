class FlickrFeeder 
{
  public FlickrFeeder(String secret, String collection, String[] tags)
  { 
    String page = "2";
    String baseURL = "https://api.flickr.com/services/rest/?method=flickr.people.getPublicPhotos&api_key=" + secret + "&user_id=" + collection + "&extras=tags&safe_search=1&per_page=500&page=" + page + "&format=json&nojsoncallback=1";
    JSONObject jsonResponse = loadJSONObject(baseURL);
    println(jsonResponse.getJSONObject("photos").getInt("pages"));
    
    JSONArray picturesCollection = jsonResponse.getJSONObject("photos").getJSONArray("photo");
    
  }
  
  public boolean available() 
  {
    return false;
  }
  
  public boolean taggedAvailable()
  {
    return false;
  }
  
  public FlickrPhoto getTagged() 
  {
    return null;
  }
  
  public FlickrPhoto getUntagged()
  {
    return null;
  }
  
}