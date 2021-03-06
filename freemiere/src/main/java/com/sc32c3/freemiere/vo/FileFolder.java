package com.sc32c3.freemiere.vo;

public class FileFolder implements Comparable<FileFolder> {
	private String email;
	private String path;
	private String info;
	
	private String strUpdate;
	private long lnUpdate;
	
	private char isShared;
	private String auth;
	
	private int ffid;
	private char isDeleted;
	
	private boolean isFolder;
	private String fileName;
	
	private char bookState;
	private long volume;

	public long getVolume() {
		return volume;
	}

	public void setVolume(long volume) {
		this.volume = volume;
	}

	public String getLastModify() {
		return lastModify;
	}

	public void setLastModify(String lastModify) {
		this.lastModify = lastModify;
	}

	public String getUploadDate() {
		return uploadDate;
	}

	public void setUploadDate(String uploadDate) {
		this.uploadDate = uploadDate;
	}

	public void setFolder(boolean isFolder) {
		this.isFolder = isFolder;
	}

	private String lastModify;
	private String uploadDate;

	public FileFolder() {
		info = new String(" ");
	}

	
	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getPath() {
		return path;
	}

	public void setPath(String path) {
		this.path = path;
	}

	public String getInfo() {
		return info;
	}

	public void setInfo(String info) {
		this.info = info;
	}

	public char getIsShared() {
		return isShared;
	}

	public void setIsShared(char isShared) {
		this.isShared = isShared;
	}

	public int getFfid() {
		return ffid;
	}

	public void setFfid(int ffid) {
		this.ffid = ffid;
	}

	public char getIsDeleted() {
		return isDeleted;
	}

	public void setIsDeleted(char isDeleted) {
		this.isDeleted = isDeleted;
	}

	public boolean getIsFolder() {
		return isFolder;
	}

	public void setIsFolder(boolean isFolder) {
		this.isFolder = isFolder;
	}

	public String getFileName() {
		return fileName;
	}

	public void setFileName(String fileName) {
		this.fileName = fileName;
	}

	public char getBookState() {
		return bookState;
	}

	public void setBookState(char bookState) {
		this.bookState = bookState;
	}

	public String getAuth() {
		return auth;
	}

	public void setAuth(String auth) {
		this.auth = auth;
	}


	public String getStrUpdate() {
		return strUpdate;
	}

	public void setStrUpdate(String strUpdate) {
		this.strUpdate = strUpdate;
	}

	public long getLnUpdate() {
		return lnUpdate;
	}

	public void setLnUpdate(long lnUpdate) {
		this.lnUpdate = lnUpdate;
	}

	@Override
	public int compareTo(FileFolder o) {
		if(this.lnUpdate  == o.getLnUpdate())
			return 0;
		else if( this.lnUpdate > o.getLnUpdate())
			return -1;
		else if( this.lnUpdate < o.getLnUpdate())
			return 1;
		//return this.getUpdatedate().compareTo(o.getUpdatedate());
		return 0;
	}
/*	@Override
	public int compareTo(FileFolder o1, FileFolder o2){
		if(o1.lastModified() < o2.last)
	}*/
	@Override
	public String toString() {
		return "FileFolder [email=" + email + ", path=" + path + ", info=" + info + ", strUpdate=" + strUpdate
				+ ", lnUpdate=" + lnUpdate + ", isShared=" + isShared + ", auth=" + auth + ", ffid=" + ffid
				+ ", isDeleted=" + isDeleted + ", isFolder=" + isFolder + ", fileName=" + fileName + ", bookState="
				+ bookState + "]";
	}

}
