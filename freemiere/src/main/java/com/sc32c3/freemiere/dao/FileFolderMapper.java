package com.sc32c3.freemiere.dao;

import java.util.ArrayList;
import java.util.HashMap;

import com.sc32c3.freemiere.vo.FileFolder;

public interface FileFolderMapper {
	public FileFolder getFilerFolerInfo(String path, String email);
	public ArrayList<FileFolder> getSharedList(String email);
	//public ArrayList<FileFolder> getMyStorageList(String email);
	public ArrayList<FileFolder> getTrashList(String email);
	public ArrayList<FileFolder> getSharedBookmarkList(String email);
	public ArrayList<FileFolder> getMyStorageBookmarkList(String email);
	public int bookmarkUpdate(HashMap<String, Object> map);
	public FileFolder boardread(int ffid);
}
