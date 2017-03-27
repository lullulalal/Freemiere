package com.sc32c3.freemiere.dao;

import java.util.ArrayList;

import com.sc32c3.freemiere.vo.FileFolder;

public interface FileFolderMapper {
	public FileFolder getFilerFolerInfo(String path);
	public ArrayList<FileFolder> getSharedList(String email);
	public ArrayList<FileFolder> getMyStorageList(String email);
	public ArrayList<FileFolder> getTrashList(String email);
	public ArrayList<FileFolder> getSharedBookmarkList(String email);
	public ArrayList<FileFolder> getMyStorageBookmarkList(String email);
}
