package com.sc32c3.freemiere.vo;

public class FileFolder {
	private String email;
	private String path;
	private String info;
	private char isShared;
	private String auth;
	private int ffid;
	private char isDeleted; 
	private boolean isFolder;
	private String fileName;
	private char bookState;
	private long volume;
	

	private String lastModify;
	
	private String uploadDate;
	public FileFolder(){
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
	@Override
	public String toString() {
		return "FileFolder [email=" + email + ", path=" + path + ", info=" + info + ", isShared=" + isShared + ", ffid="
				+ ffid + ", isDeleted=" + isDeleted + ", isFolder=" + isFolder + ", fileName=" + fileName
				+ ", bookState=" + bookState + "]";
	}



}
