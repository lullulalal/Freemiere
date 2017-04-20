package com.sc32c3.freemiere.dao;

import java.util.ArrayList;
import java.util.HashMap;

import com.sc32c3.freemiere.vo.FileFolder;

public interface FileFolderMapper {
	
	
	public FileFolder getFilerFolerInfo(String path, String email);

	public ArrayList<FileFolder> getSharedList(String email);

	// public ArrayList<FileFolder> getMyStorageList(String email);
	public ArrayList<FileFolder> getTrashList(String email);

	public ArrayList<FileFolder> getSharedBookmarkList(String email);

	public ArrayList<FileFolder> getMyStorageBookmarkList(String email);

	public int deleteFileFolder(int ffid);

	public int deleteBookmarks(HashMap<String, Object>bookmarks );
	
	public int deleteShare(HashMap<String, Object>shares);
	
	public int upload(FileFolder fileFolder);

	//새폴더(경로와 이메일 정보를 가져온다.)
	public int newDir(String path, String email);
	
	public int getffid(String path);
}
