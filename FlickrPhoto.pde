class FlickrPhoto
{
  private String id;  
  private String owner;
  private String server;
  private int farm;
  private String secret;
  private String tags;
  
  public boolean ready;
  public PImage image;
  public boolean downloading;
  
  private boolean local;
  
  public FlickrPhoto(JSONObject json, boolean local) 
  {
    init();
    
    id = json.getString("id");
    tags = json.getString("tags");
    owner = json.getString("owner");
    server = json.getString("server");
    farm = json.getInt("farm");
    secret = json.getString("secret");
    
    this.local = local;
  }
  
  private void init() {
    ready = false;
    image = null;
    downloading = false;
  }

  public String path() {
    String url = "https://farm" + this.farm + ".staticflickr.com/" + this.server;
    url += "/" + this.id + "_" + this.secret + "_m.jpg";
    return url;
  }
  
}