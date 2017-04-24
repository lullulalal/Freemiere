package com.sc32c3.freemiere.vo;

public class FolderVo {
	
	private int id;
	private int pId;
	private String name;
	private boolean isParent;
	private boolean open;
	private String path;
	
	public FolderVo(){};
	
	public FolderVo(String path, int id, int pId, String name, boolean isParent, boolean open) {
		super();
		this.path = path;
		this.id = id;
		this.pId = pId;
		this.name = name;
		this.isParent = isParent;
		this.open = open;
	}
	
	public String getPath() {
		return path;
	}
	public void setPath(String path) {
		this.path = path;
	}
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}

	public int getpId() {
		return pId;
	}

	public void setpId(int pId) {
		this.pId = pId;
	}

	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	
	public boolean getIsParent() {
		return isParent;
	}
	public void setIsParent(boolean isParent) {
		this.isParent = isParent;
	}
	public boolean getOpen() {
		return open;
	}
	public void setOpen(boolean open) {
		this.open = open;
	}

	@Override
	public String toString() {
		return "FolderVo [id=" + id + ", pId=" + pId + ", name=" + name + ", isParent=" + isParent + ", open=" + open
				+ ", path=" + path + "]";
	}
	
	
}
