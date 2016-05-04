class FlickrFeeder
{
  private ArrayList tagged;
  private ArrayList untagged;

  public FlickrFeeder(String secret, String collection, String[] tags)
  { 
    tagged = new ArrayList();
    untagged = new ArrayList();

    String page = "2";
    String baseURL = "https://api.flickr.com/services/rest/?method=flickr.people.getPublicPhotos&api_key=" + secret + "&user_id=" + collection + "&extras=tags&safe_search=1&per_page=500&page=" + page + "&format=json&nojsoncallback=1";
    JSONObject jsonResponse = loadJSONObject(baseURL);
    
    JSONArray picturesCollection = jsonResponse.getJSONObject("photos").getJSONArray("photo");
    for (int i = 0; i < picturesCollection.size(); i++) {
      JSONObject json = picturesCollection.getJSONObject(i);
      FlickrPhoto picture = new FlickrPhoto(json, false);

      int j = 0;
      for (j = 0; j < tags.length; j++) {
        if (picture.tags != null && picture.tags.indexOf(tags[j]) != -1) {
          tagged.add(picture);
          break;
        }
      }
      if (j == tags.length) {
        untagged.add(picture);
      }
    }
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