class FlickrPhoto
{
  public String flickrid;
  public String url;
  public String tag;
  public String largeSquare;
  public String small;
  public String medium;
  public String large;
  
  public boolean ready;
  public PImage image;
  public boolean downloading;
  
  private boolean local;
  
  public FlickrPhoto(String csv, boolean local)
  {
    ready = false;
    image = null;
    downloading = false;
    
    String[] data = split(csv, ',');
    flickrid = data[0];
    url = data[1];
    tag = data[2];
    largeSquare = data[3];
    small = data[4];
    medium = data[5];
    large = data[6];    
    
    this.local = local;
  }
  
  public String path()
  {
    return  this.local ? "data/repo_all/" + this.flickrid + ".jpg" : this.small;
  }
  
}