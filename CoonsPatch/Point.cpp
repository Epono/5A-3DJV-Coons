#include "Point.h"

Point::Point() : _x(0), _y(0)
{
}

Point::Point(int x, int y) : _x(x), _y(y)
{
}

Point::Point(const Point& point) : _x(point.getX()), _y(point.getY())
{
}

Point::~Point()
{
}