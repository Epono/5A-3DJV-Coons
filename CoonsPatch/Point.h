#pragma once
class Point
{
private:
	int _x;
	int _y;

public:
	Point();
	Point(const int x, const int y);
	Point(const Point& point);

	int getX() const { return _x; }
	//void setX(int val) { _x = val; }
	int getY() const { return _y; }
	//void setY(int val) { _y = val; }

	~Point();
};